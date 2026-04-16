package com.aerosecure.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MaintenanceRequest {
    @NotNull(message = "Aircraft ID is required")
    private Long aircraftId;

    private Long assignedEngineerId;

    @NotBlank(message = "Task description is required")
    private String taskDescription;

    private String priority;
    private String status;

    @NotBlank(message = "Scheduled date is required")
    private String scheduledDate;

    private String completionDate;
    private Integer estimatedHours;
    private Integer actualHours;
    private String remarks;

    public MaintenanceRequest() {}

    public Long getAircraftId() { return aircraftId; }
    public void setAircraftId(Long aircraftId) { this.aircraftId = aircraftId; }
    public Long getAssignedEngineerId() { return assignedEngineerId; }
    public void setAssignedEngineerId(Long assignedEngineerId) { this.assignedEngineerId = assignedEngineerId; }
    public String getTaskDescription() { return taskDescription; }
    public void setTaskDescription(String taskDescription) { this.taskDescription = taskDescription; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }
    public String getCompletionDate() { return completionDate; }
    public void setCompletionDate(String completionDate) { this.completionDate = completionDate; }
    public Integer getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }
    public Integer getActualHours() { return actualHours; }
    public void setActualHours(Integer actualHours) { this.actualHours = actualHours; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
