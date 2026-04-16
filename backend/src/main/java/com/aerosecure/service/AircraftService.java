package com.aerosecure.service;

import com.aerosecure.dto.request.AircraftRequest;
import com.aerosecure.entity.Aircraft;
import com.aerosecure.enums.AircraftStatus;
import com.aerosecure.exception.ResourceNotFoundException;
import com.aerosecure.repository.AircraftRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AircraftService {

    private final AircraftRepository aircraftRepository;

    public AircraftService(AircraftRepository aircraftRepository) {
        this.aircraftRepository = aircraftRepository;
    }

    public Page<Aircraft> getAllAircraft(String search, String status, Pageable pageable) {
        AircraftStatus aircraftStatus = null;
        if (status != null && !status.isEmpty()) {
            aircraftStatus = AircraftStatus.valueOf(status.toUpperCase());
        }
        return aircraftRepository.findWithFilters(search, aircraftStatus, pageable);
    }

    public List<Aircraft> getAllAircraftList() {
        return aircraftRepository.findAll();
    }

    public Aircraft getAircraftById(Long id) {
        return aircraftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aircraft", id));
    }

    public Aircraft createAircraft(AircraftRequest request) {
        Aircraft aircraft = new Aircraft();
        mapRequestToEntity(request, aircraft);
        return aircraftRepository.save(aircraft);
    }

    public Aircraft updateAircraft(Long id, AircraftRequest request) {
        Aircraft aircraft = getAircraftById(id);
        mapRequestToEntity(request, aircraft);
        return aircraftRepository.save(aircraft);
    }

    public void deleteAircraft(Long id) {
        Aircraft aircraft = getAircraftById(id);
        aircraftRepository.delete(aircraft);
    }

    public List<Aircraft> getAircraftByStatus(String status) {
        return aircraftRepository.findByStatus(AircraftStatus.valueOf(status.toUpperCase()));
    }

    public long countByStatus(AircraftStatus status) {
        return aircraftRepository.countByStatus(status);
    }

    public long countTotal() {
        return aircraftRepository.count();
    }

    private void mapRequestToEntity(AircraftRequest request, Aircraft aircraft) {
        aircraft.setAircraftId(request.getAircraftId());
        aircraft.setModel(request.getModel());
        aircraft.setManufacturer(request.getManufacturer());
        aircraft.setSerialNumber(request.getSerialNumber());
        aircraft.setYearManufactured(request.getYearManufactured());
        if (request.getTotalFlightHours() != null) {
            aircraft.setTotalFlightHours(request.getTotalFlightHours());
        }
        if (request.getStatus() != null) {
            aircraft.setStatus(AircraftStatus.valueOf(request.getStatus().toUpperCase()));
        }
        aircraft.setAirline(request.getAirline());
    }
}
