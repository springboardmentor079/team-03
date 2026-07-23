export const dummyAttendance = [
  {
    _id: "att-001",
    projectId: "proj-001",
    workerName: "Carlos Mendez",
    role: "Mason / Steel Fixer",
    date: "2026-07-23",
    status: "Present",
    hours: 8.0,
    remarks: "On-site foundation work"
  },
  {
    _id: "att-002",
    projectId: "proj-001",
    workerName: "David Miller",
    role: "Equipment Operator",
    date: "2026-07-23",
    status: "Present",
    hours: 9.5,
    remarks: "Overtime crane operation"
  },
  {
    _id: "att-003",
    projectId: "proj-001",
    workerName: "Elena Rostova",
    role: "Site Electrician",
    date: "2026-07-23",
    status: "Present",
    hours: 8.0,
    remarks: "Riser conduit installation"
  },
  {
    _id: "att-004",
    projectId: "proj-001",
    workerName: "James Wilson",
    role: "Safety Supervisor",
    date: "2026-07-23",
    status: "Half-day",
    hours: 4.0,
    remarks: "Morning audit shift"
  },
  {
    _id: "att-005",
    projectId: "proj-001",
    workerName: "Robert Taylor",
    role: "Carpenter",
    date: "2026-07-23",
    status: "Absent",
    hours: 0,
    remarks: "Sick leave reported"
  },
  {
    _id: "att-006",
    projectId: "proj-002",
    workerName: "Marcus Vance",
    role: "Subway Shoring Tech",
    date: "2026-07-23",
    status: "Present",
    hours: 8.0,
    remarks: "Tunnel inspection"
  }
];

const STORAGE_KEY = 'buildtrack_attendance';

const getStoredAttendance = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyAttendance));
      return [...dummyAttendance];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading attendance storage:', err);
    return [...dummyAttendance];
  }
};

const saveStoredAttendance = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving attendance storage:', err);
  }
};

/**
 * Gets attendance records for a project.
 */
export const getAttendanceByProjectId = (projectId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredAttendance();
      const filtered = all.filter((rec) => rec.projectId === projectId);
      resolve([...filtered]);
    }, 500);
  });
};

/**
 * Marks or updates attendance for a worker.
 */
export const markAttendance = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStoredAttendance();
      const existingIdx = all.findIndex(
        (rec) => rec.projectId === data.projectId && rec.workerName.toLowerCase() === data.workerName.toLowerCase() && rec.date === data.date
      );

      const record = {
        _id: existingIdx !== -1 ? all[existingIdx]._id : 'att-' + Math.random().toString(36).substring(2, 11),
        projectId: data.projectId,
        workerName: data.workerName,
        role: data.role || 'Site Worker',
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'Present',
        hours: Number(data.hours) || (data.status === 'Absent' ? 0 : 8.0),
        remarks: data.remarks || ''
      };

      if (existingIdx !== -1) {
        all[existingIdx] = record;
      } else {
        all.push(record);
      }

      saveStoredAttendance(all);
      resolve({ ...record });
    }, 500);
  });
};

export default {
  getAttendanceByProjectId,
  markAttendance
};
