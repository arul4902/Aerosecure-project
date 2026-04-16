package com.aerosecure.controller;

import com.aerosecure.dto.request.AircraftRequest;
import com.aerosecure.dto.response.ApiResponse;
import com.aerosecure.entity.Aircraft;
import com.aerosecure.service.AircraftService;
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
@RequestMapping("/api/aircraft")
@Tag(name = "Aircraft", description = "Aircraft Fleet Management APIs")
public class AircraftController {

    private final AircraftService aircraftService;

    public AircraftController(AircraftService aircraftService) {
        this.aircraftService = aircraftService;
    }

    @GetMapping
    @Operation(summary = "Get all aircraft (paginated)")
    public ResponseEntity<ApiResponse<Page<Aircraft>>> getAllAircraft(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<Aircraft> aircraft = aircraftService.getAllAircraft(search, status, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Aircraft retrieved", aircraft));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all aircraft (no pagination)")
    public ResponseEntity<ApiResponse<List<Aircraft>>> getAllAircraftList() {
        return ResponseEntity.ok(ApiResponse.success("Aircraft list retrieved", aircraftService.getAllAircraftList()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get aircraft by ID")
    public ResponseEntity<ApiResponse<Aircraft>> getAircraftById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Aircraft retrieved", aircraftService.getAircraftById(id)));
    }

    @PostMapping
    @Operation(summary = "Create new aircraft")
    public ResponseEntity<ApiResponse<Aircraft>> createAircraft(@Valid @RequestBody AircraftRequest request) {
        Aircraft aircraft = aircraftService.createAircraft(request);
        return ResponseEntity.ok(ApiResponse.success("Aircraft created successfully", aircraft));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update aircraft")
    public ResponseEntity<ApiResponse<Aircraft>> updateAircraft(@PathVariable Long id,
                                                                 @Valid @RequestBody AircraftRequest request) {
        Aircraft aircraft = aircraftService.updateAircraft(id, request);
        return ResponseEntity.ok(ApiResponse.success("Aircraft updated successfully", aircraft));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete aircraft")
    public ResponseEntity<ApiResponse<Void>> deleteAircraft(@PathVariable Long id) {
        aircraftService.deleteAircraft(id);
        return ResponseEntity.ok(ApiResponse.success("Aircraft deleted successfully"));
    }
}
