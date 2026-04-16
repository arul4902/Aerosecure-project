package com.aerosecure.dto.response;

import java.util.Map;
import java.util.List;

public class DashboardResponse {
    private long totalAircraft;
    private long activeAircraft;
    private long underMaintenance;
    private long retiredAircraft;
    private long totalMaintenanceTasks;
    private long plannedTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long totalSpareParts;
    private long lowStockParts;
    private long outOfStockParts;
    private long totalComplianceRecords;
    private long compliantRecords;
    private long nonCompliantRecords;
    private long pendingRecords;
    private double overallComplianceScore;
    private List<Map<String, Object>> recentMaintenanceTasks;
    private List<Map<String, Object>> lowStockAlerts;
    private List<Map<String, Object>> nonComplianceAlerts;

    public DashboardResponse() {}

    // Getters and Setters
    public long getTotalAircraft() { return totalAircraft; }
    public void setTotalAircraft(long totalAircraft) { this.totalAircraft = totalAircraft; }
    public long getActiveAircraft() { return activeAircraft; }
    public void setActiveAircraft(long activeAircraft) { this.activeAircraft = activeAircraft; }
    public long getUnderMaintenance() { return underMaintenance; }
    public void setUnderMaintenance(long underMaintenance) { this.underMaintenance = underMaintenance; }
    public long getRetiredAircraft() { return retiredAircraft; }
    public void setRetiredAircraft(long retiredAircraft) { this.retiredAircraft = retiredAircraft; }
    public long getTotalMaintenanceTasks() { return totalMaintenanceTasks; }
    public void setTotalMaintenanceTasks(long totalMaintenanceTasks) { this.totalMaintenanceTasks = totalMaintenanceTasks; }
    public long getPlannedTasks() { return plannedTasks; }
    public void setPlannedTasks(long plannedTasks) { this.plannedTasks = plannedTasks; }
    public long getInProgressTasks() { return inProgressTasks; }
    public void setInProgressTasks(long inProgressTasks) { this.inProgressTasks = inProgressTasks; }
    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }
    public long getTotalSpareParts() { return totalSpareParts; }
    public void setTotalSpareParts(long totalSpareParts) { this.totalSpareParts = totalSpareParts; }
    public long getLowStockParts() { return lowStockParts; }
    public void setLowStockParts(long lowStockParts) { this.lowStockParts = lowStockParts; }
    public long getOutOfStockParts() { return outOfStockParts; }
    public void setOutOfStockParts(long outOfStockParts) { this.outOfStockParts = outOfStockParts; }
    public long getTotalComplianceRecords() { return totalComplianceRecords; }
    public void setTotalComplianceRecords(long totalComplianceRecords) { this.totalComplianceRecords = totalComplianceRecords; }
    public long getCompliantRecords() { return compliantRecords; }
    public void setCompliantRecords(long compliantRecords) { this.compliantRecords = compliantRecords; }
    public long getNonCompliantRecords() { return nonCompliantRecords; }
    public void setNonCompliantRecords(long nonCompliantRecords) { this.nonCompliantRecords = nonCompliantRecords; }
    public long getPendingRecords() { return pendingRecords; }
    public void setPendingRecords(long pendingRecords) { this.pendingRecords = pendingRecords; }
    public double getOverallComplianceScore() { return overallComplianceScore; }
    public void setOverallComplianceScore(double overallComplianceScore) { this.overallComplianceScore = overallComplianceScore; }
    public List<Map<String, Object>> getRecentMaintenanceTasks() { return recentMaintenanceTasks; }
    public void setRecentMaintenanceTasks(List<Map<String, Object>> recentMaintenanceTasks) { this.recentMaintenanceTasks = recentMaintenanceTasks; }
    public List<Map<String, Object>> getLowStockAlerts() { return lowStockAlerts; }
    public void setLowStockAlerts(List<Map<String, Object>> lowStockAlerts) { this.lowStockAlerts = lowStockAlerts; }
    public List<Map<String, Object>> getNonComplianceAlerts() { return nonComplianceAlerts; }
    public void setNonComplianceAlerts(List<Map<String, Object>> nonComplianceAlerts) { this.nonComplianceAlerts = nonComplianceAlerts; }
}
