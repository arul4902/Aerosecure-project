package com.aerosecure.controller;

import com.aerosecure.dto.request.ComplianceRequest;
import com.aerosecure.dto.response.ApiResponse;
import com.aerosecure.entity.ComplianceRecord;
import com.aerosecure.service.ComplianceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compliance")
@Tag(name = "Compliance", description = "Compliance & Safety Audit APIs")
public class ComplianceController {

    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping
    @Operation(summary = "Get all compliance records (paginated)")
    public ResponseEntity<ApiResponse<Page<ComplianceRecord>>> getAllRecords(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long aircraftId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "auditDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<ComplianceRecord> records = complianceService.getAllRecords(status, aircraftId,
                PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Records retrieved", records));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get compliance record by ID")
    public ResponseEntity<ApiResponse<ComplianceRecord>> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Record retrieved", complianceService.getRecordById(id)));
    }

    @GetMapping("/non-compliant")
    @Operation(summary = "Get non-compliant records")
    public ResponseEntity<ApiResponse<List<ComplianceRecord>>> getNonCompliant() {
        return ResponseEntity.ok(ApiResponse.success("Non-compliant records retrieved",
                complianceService.getNonCompliantRecords()));
    }

    @PostMapping
    @Operation(summary = "Create compliance record")
    public ResponseEntity<ApiResponse<ComplianceRecord>> createRecord(@Valid @RequestBody ComplianceRequest request) {
        ComplianceRecord record = complianceService.createRecord(request);
        return ResponseEntity.ok(ApiResponse.success("Record created successfully", record));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update compliance record")
    public ResponseEntity<ApiResponse<ComplianceRecord>> updateRecord(@PathVariable Long id,
                                                                       @RequestBody ComplianceRequest request) {
        ComplianceRecord record = complianceService.updateRecord(id, request);
        return ResponseEntity.ok(ApiResponse.success("Record updated successfully", record));
    }
}
