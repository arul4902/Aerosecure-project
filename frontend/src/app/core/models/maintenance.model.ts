export interface MaintenanceSchedule {
  id: number;
  aircraft: { id: number; aircraftId: string; model: string; };
  assignedEngineer: { id: number; fullName: string; username: string; } | null;
  taskDescription: string;
  priority: string;
  status: string;
  scheduledDate: string;
  completionDate: string | null;
  estimatedHours: number;
  actualHours: number | null;
  remarks: string;
  createdAt: string;
}
