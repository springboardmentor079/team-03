const Report = require('../models/Report');

/**
 * =====================================================================
 * ASSUMPTIONS — I do not have your Project / Milestone / Inventory /
 * Procurement / Workforce model files, so the field names below are
 * best-guess based on common naming conventions in this kind of app.
 * Please verify/adjust the marked lines against your real schemas.
 * =====================================================================
 */

// Load related models defensively so a missing/renamed model file
// doesn't crash the whole controller — it just skips that metric.
const safeRequire = (modelPath) => {
  try {
    return require(modelPath);
  } catch (err) {
    return null;
  }
};

const Project = safeRequire('../models/Project');
const Milestone = safeRequire('../models/Milestone');
const Inventory = safeRequire('../models/Inventory');
const Procurement = safeRequire('../models/Procurement') || safeRequire('../models/PurchaseOrder');
const Invoice = safeRequire('../models/Invoice');
const Workforce = safeRequire('../models/Workforce') || safeRequire('../models/Attendance');

// -------- Individual metric calculators (each fails safely) --------

// ASSUMPTION: Project.progress is a Number (0-100). If you instead track
// progress purely via Milestones, this falls back to
// (completed milestones / total milestones) * 100.
const getProjectProgress = async (projectId) => {
  try {
    if (Project) {
      const project = await Project.findById(projectId).select('progress');
      if (project && typeof project.progress === 'number') {
        return project.progress;
      }
    }
    if (Milestone) {
      const total = await Milestone.countDocuments({ project: projectId });
      if (total === 0) return 0;
      // ASSUMPTION: Milestone has a `status` field with a 'COMPLETED' value,
      // or a boolean `completed` field. Adjust to match your schema.
      const completed = await Milestone.countDocuments({
        project: projectId,
        $or: [{ status: 'COMPLETED' }, { completed: true }],
      });
      return Math.round((completed / total) * 100);
    }
    return null;
  } catch (err) {
    console.error('getProjectProgress error:', err.message);
    return null;
  }
};

// ASSUMPTION: Project has `budget.total` and `budget.spent` fields (or flat
// `budgetTotal` / `budgetSpent`). Falls back to summing Invoice amounts.
const getBudgetSpend = async (projectId) => {
  try {
    if (Project) {
      const project = await Project.findById(projectId).select('budget budgetTotal budgetSpent');
      if (project) {
        const total = project.budget?.total ?? project.budgetTotal ?? null;
        const spent = project.budget?.spent ?? project.budgetSpent ?? null;
        if (total !== null || spent !== null) {
          return { total, spent, remaining: total !== null && spent !== null ? total - spent : null };
        }
      }
    }
    if (Invoice) {
      // ASSUMPTION: Invoice has `project`, `amount`, and `status` fields.
      const result = await Invoice.aggregate([
        { $match: { project: projectId } },
        { $group: { _id: '$status', total: { $sum: '$amount' } } },
      ]);
      const spent = result.find((r) => r._id === 'PAID')?.total || 0;
      const pending = result.find((r) => r._id !== 'PAID')?.total || 0;
      return { spent, pending };
    }
    return null;
  } catch (err) {
    console.error('getBudgetSpend error:', err.message);
    return null;
  }
};

// ASSUMPTION: Workforce/Attendance model has `project`, `date`, and a
// `status` field with values like 'PRESENT' / 'ABSENT'.
const getWorkforceAttendance = async (projectId) => {
  try {
    if (!Workforce) return null;

    const total = await Workforce.countDocuments({ project: projectId });
    if (total === 0) return { totalRecords: 0, attendanceRate: null };

    const present = await Workforce.countDocuments({
      project: projectId,
      status: 'PRESENT',
    });

    return {
      totalRecords: total,
      presentCount: present,
      attendanceRate: Math.round((present / total) * 100),
    };
  } catch (err) {
    console.error('getWorkforceAttendance error:', err.message);
    return null;
  }
};

// ASSUMPTION: Procurement/PurchaseOrder model has `project`, `totalAmount`,
// and `status` fields.
const getProcurementTotals = async (projectId) => {
  try {
    if (!Procurement) return null;

    const result = await Procurement.aggregate([
      { $match: { project: projectId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    return result[0]
      ? { totalOrders: result[0].totalOrders, totalAmount: result[0].totalAmount }
      : { totalOrders: 0, totalAmount: 0 };
  } catch (err) {
    console.error('getProcurementTotals error:', err.message);
    return null;
  }
};

// -------- Controllers --------

// @desc    Get report history for a specific project
// @route   GET /api/reports?project=<id>
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .populate('generatedBy', 'name email')
      .populate('project', 'name');

    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

// @desc    Aggregate real metrics and generate a new report record
// @route   POST /api/reports
// @body    { title, reportType, project }
// @access  Private
exports.generateReport = async (req, res) => {
  try {
    const { title, reportType, project } = req.body;

    if (!title || !reportType || !project) {
      return res.status(400).json({ message: 'title, reportType, and project are required' });
    }

    const [progress, budget, attendance, procurement] = await Promise.all([
      getProjectProgress(project),
      getBudgetSpend(project),
      getWorkforceAttendance(project),
      getProcurementTotals(project),
    ]);

    const parameters = {
      projectProgressPercent: progress,
      budget,
      workforceAttendance: attendance,
      procurementTotals: procurement,
      generatedAt: new Date(),
    };

    const report = await Report.create({
      title,
      reportType,
      project,
      generatedBy: req.user.id,
      parameters,
    });

    res.status(201).json({ message: 'Report generated', report });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};

// @desc    Delete a report record
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete report', error: error.message });
  }
};
