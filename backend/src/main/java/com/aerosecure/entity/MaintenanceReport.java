package com.aerosecure.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_report")
public class MaintenanceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aircraft_id", nullable = false)
    private Aircraft aircraft;

    @Column(name = "report_type", length = 50)
    private String reportType;

    @Column(name = "mtbf_hours")
    private Double mtbfHours;

    @Column(name = "downtime_hours")
    private Double downtimeHours;

    @Column(name = "compliance_score")
    private Double complianceScore;

    @Column(name = "total_tasks_completed")
    private Integer totalTasksCompleted;

    @Column(name = "total_parts_used")
    private Integer totalPartsUsed;

    @Column(name = "report_period_start")
    private LocalDate reportPeriodStart;

    @Column(name = "report_period_end")
    private LocalDate reportPeriodEnd;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        this.generatedAt = LocalDateTime.now();
    }

    public MaintenanceReport() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aircraft getAircraft() { return aircraft; }
    public void setAircraft(Aircraft aircraft) { this.aircraft = aircraft; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public Double getMtbfHours() { return mtbfHours; }
    public void setMtbfHours(Double mtbfHours) { this.mtbfHours = mtbfHours; }

    public Double getDowntimeHours() { return downtimeHours; }
    public void setDowntimeHours(Double downtimeHours) { this.downtimeHours = downtimeHours; }

    public Double getComplianceScore() { return complianceScore; }
    public void setComplianceScore(Double complianceScore) { this.complianceScore = complianceScore; }

    public Integer getTotalTasksCompleted() { return totalTasksCompleted; }
    public void setTotalTasksCompleted(Integer totalTasksCompleted) { this.totalTasksCompleted = totalTasksCompleted; }

    public Integer getTotalPartsUsed() { return totalPartsUsed; }
    public void setTotalPartsUsed(Integer totalPartsUsed) { this.totalPartsUsed = totalPartsUsed; }

    public LocalDate getReportPeriodStart() { return reportPeriodStart; }
    public void setReportPeriodStart(LocalDate reportPeriodStart) { this.reportPeriodStart = reportPeriodStart; }

    public LocalDate getReportPeriodEnd() { return reportPeriodEnd; }
    public void setReportPeriodEnd(LocalDate reportPeriodEnd) { this.reportPeriodEnd = reportPeriodEnd; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
