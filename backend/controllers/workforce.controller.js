const Worker = require('../models/worker');
const Attendance = require('../models/attendance');

// ---------- WORKER CRUD ----------

const createWorker = async (req, res) => {
  try {
    const worker = await Worker.create(req.body);
    res.status(201).json(worker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().populate('assignedProject');
    res.status(200).json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('assignedProject');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.status(200).json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.status(200).json(worker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.status(200).json({ message: 'Worker deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- ATTENDANCE ----------

const markAttendance = async (req, res) => {
  try {
    // Normalize to midnight (start of day) so repeated calls on the same
    // calendar day collide on the {worker, project, date} unique index,
    // instead of each getting a distinct millisecond timestamp.
    const attendanceDate = req.body.date ? new Date(req.body.date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.create({
      ...req.body,
      worker: req.params.workerId,
      date: attendanceDate,
    });
    res.status(201).json(attendance);
  } catch (err) {
    // Duplicate {worker, project, date} compound index -> Mongo error code 11000
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Attendance already recorded for this worker, project, and date' });
    }
    res.status(400).json({ message: err.message });
  }
};

const getWorkerAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ worker: req.params.workerId })
      .populate('project')
      .sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    res.status(200).json(attendance);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Attendance already recorded for this worker, project, and date' });
    }
    res.status(400).json({ message: err.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  markAttendance,
  getWorkerAttendance,
  updateAttendance,
  deleteAttendance,
};
