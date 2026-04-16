export interface ComplianceRecord {
  id: number;
  aircraft: { id: number; aircraftId: string; model: string; };
  auditor: { id: number; fullName: string; } | null;
  auditDate: string;
  regulationType: string;
  complianceStatus: string;
  findings: string;
  remarks: string;
  nextAuditDate: string;
  createdAt: string;
}
