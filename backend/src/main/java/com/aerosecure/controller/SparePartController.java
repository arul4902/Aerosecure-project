package com.aerosecure.controller;

import com.aerosecure.dto.request.SparePartRequest;
import com.aerosecure.dto.response.ApiResponse;
import com.aerosecure.entity.SparePart;
import com.aerosecure.service.SparePartService;
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
@RequestMapping("/api/parts")
@Tag(name = "Spare Parts", description = "Spare Parts Inventory APIs")
public class SparePartController {

    private final SparePartService sparePartService;

    public SparePartController(SparePartService sparePartService) {
        this.sparePartService = sparePartService;
    }

    @GetMapping
    @Operation(summary = "Get all spare parts (paginated)")
    public ResponseEntity<ApiResponse<Page<SparePart>>> getAllParts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<SparePart> parts = sparePartService.getAllParts(search, status, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Parts retrieved", parts));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get spare part by ID")
    public ResponseEntity<ApiResponse<SparePart>> getPartById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Part retrieved", sparePartService.getPartById(id)));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get low stock alerts")
    public ResponseEntity<ApiResponse<List<SparePart>>> getLowStockParts() {
        return ResponseEntity.ok(ApiResponse.success("Low stock parts retrieved",
                sparePartService.getLowStockParts()));
    }

    @PostMapping
    @Operation(summary = "Add new spare part")
    public ResponseEntity<ApiResponse<SparePart>> createPart(@Valid @RequestBody SparePartRequest request) {
        SparePart part = sparePartService.createPart(request);
        return ResponseEntity.ok(ApiResponse.success("Part created successfully", part));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update spare part")
    public ResponseEntity<ApiResponse<SparePart>> updatePart(@PathVariable Long id,
                                                              @Valid @RequestBody SparePartRequest request) {
        SparePart part = sparePartService.updatePart(id, request);
        return ResponseEntity.ok(ApiResponse.success("Part updated successfully", part));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete spare part")
    public ResponseEntity<ApiResponse<Void>> deletePart(@PathVariable Long id) {
        sparePartService.deletePart(id);
        return ResponseEntity.ok(ApiResponse.success("Part deleted successfully"));
    }

    @PostMapping("/{id}/procure")
    @Operation(summary = "Simulate procurement")
    public ResponseEntity<ApiResponse<SparePart>> simulateProcurement(@PathVariable Long id,
                                                                       @RequestBody Map<String, Integer> body) {
        SparePart part = sparePartService.simulateProcurement(id, body.getOrDefault("quantity", 10));
        return ResponseEntity.ok(ApiResponse.success("Procurement simulated successfully", part));
    }
}
