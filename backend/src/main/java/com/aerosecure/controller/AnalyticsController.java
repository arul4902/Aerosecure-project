package com.aerosecure.controller;

import com.aerosecure.dto.response.ApiResponse;
import com.aerosecure.dto.response.DashboardResponse;
import com.aerosecure.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Predictive Analytics & Reporting APIs")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard summary stats")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved",
                analyticsService.getDashboardStats()));
    }

    @GetMapping("/mtbf")
    @Operation(summary = "Get MTBF data for all aircraft")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMtbfData() {
        return ResponseEntity.ok(ApiResponse.success("MTBF data retrieved",
                analyticsService.getMtbfData()));
    }

    @GetMapping("/downtime")
    @Operation(summary = "Get downtime analysis data")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDowntimeData() {
        return ResponseEntity.ok(ApiResponse.success("Downtime data retrieved",
                analyticsService.getDowntimeData()));
    }

    @GetMapping("/compliance-score")
    @Operation(summary = "Get compliance score data")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getComplianceScoreData() {
        return ResponseEntity.ok(ApiResponse.success("Compliance score data retrieved",
                analyticsService.getComplianceScoreData()));
    }

    @GetMapping("/export/{type}")
    @Operation(summary = "Export data as CSV")
    public ResponseEntity<byte[]> exportCsv(@PathVariable String type) {
        String csv = analyticsService.exportToCsv(type);
        byte[] bytes = csv.getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + type + "_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(bytes.length)
                .body(bytes);
    }
}
