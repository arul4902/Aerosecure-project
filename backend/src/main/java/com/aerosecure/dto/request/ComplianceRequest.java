package com.aerosecure.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ComplianceRequest {
    @NotNull(message = "Aircraft ID is required")
    private Long aircraftId;

    private Long auditorId;

    @NotBlank(message = "Audit date is required")
    private String auditDate;

    private String regulationType;
    private String complianceStatus;
    private String findings;
    private String remarks;
    private String nextAuditDate;

    public ComplianceRequest() {}

    public Long getAircraftId() { return aircraftId; }
    public void setAircraftId(Long aircraftId) { this.aircraftId = aircraftId; }
    public Long getAuditorId() { return auditorId; }
    public void setAuditorId(Long auditorId) { this.auditorId = auditorId; }
    public String getAuditDate() { return auditDate; }
    public void setAuditDate(String auditDate) { this.auditDate = auditDate; }
    public String getRegulationType() { return regulationType; }
    public void setRegulationType(String regulationType) { this.regulationType = regulationType; }
    public String getComplianceStatus() { return complianceStatus; }
    public void setComplianceStatus(String complianceStatus) { this.complianceStatus = complianceStatus; }
    public String getFindings() { return findings; }
    public void setFindings(String findings) { this.findings = findings; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getNextAuditDate() { return nextAuditDate; }
    public void setNextAuditDate(String nextAuditDate) { this.nextAuditDate = nextAuditDate; }
}
