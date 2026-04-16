package com.aerosecure.controller;

import com.aerosecure.dto.request.MaintenanceRequest;
import com.aerosecure.dto.response.ApiResponse;
import com.aerosecure.entity.MaintenanceSchedule;
import com.aerosecure.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@Tag(name = "Maintenance", description = "Maintenance Scheduling APIs")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    @Operation(summary = "Get all maintenance schedules (paginated)")
    public ResponseEntity<ApiResponse<Page<MaintenanceSchedule>>> getAllSchedules(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long aircraftId,
            @RequestParam(required = false) Long engineerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "scheduledDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<MaintenanceSchedule> schedules = maintenanceService.getAllSchedules(status, aircraftId, engineerId,
                PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Schedules retrieved", schedules));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance schedule by ID")
    public ResponseEntity<ApiResponse<MaintenanceSchedule>> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Schedule retrieved", maintenanceService.getScheduleById(id)));
    }

    @GetMapping("/engineer/{engineerId}")
    @Operation(summary = "Get schedules assigned to engineer")
    public ResponseEntity<ApiResponse<List<MaintenanceSchedule>>> getByEngineer(@PathVariable Long engineerId) {
        return ResponseEntity.ok(ApiResponse.success("Engineer schedules retrieved",
                maintenanceService.getSchedulesByEngineer(engineerId)));
    }

    @PostMapping
    @Operation(summary = "Create maintenance schedule")
    public ResponseEntity<ApiResponse<MaintenanceSchedule>> createSchedule(
            @Valid @RequestBody MaintenanceRequest request) {
        MaintenanceSchedule schedule = maintenanceService.createSchedule(request);
        return ResponseEntity.ok(ApiResponse.success("Schedule created successfully", schedule));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update maintenance schedule")
    public ResponseEntity<ApiResponse<MaintenanceSchedule>> updateSchedule(@PathVariable Long id,
                                                                            @RequestBody MaintenanceRequest request) {
        MaintenanceSchedule schedule = maintenanceService.updateSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", schedule));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign engineer to schedule")
    public ResponseEntity<ApiResponse<MaintenanceSchedule>> assignEngineer(@PathVariable Long id,
                                                                           @RequestBody Map<String, Long> body) {
        MaintenanceSchedule schedule = maintenanceService.assignEngineer(id, body.get("engineerId"));
        return ResponseEntity.ok(ApiResponse.success("Engineer assigned successfully", schedule));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update schedule status")
    public ResponseEntity<ApiResponse<MaintenanceSchedule>> updateStatus(@PathVariable Long id,
                                                                          @RequestBody Map<String, String> body) {
        MaintenanceSchedule schedule = maintenanceService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", schedule));
    }
}
