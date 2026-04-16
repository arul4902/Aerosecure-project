package com.aerosecure.service;

import com.aerosecure.dto.request.ComplianceRequest;
import com.aerosecure.entity.Aircraft;
import com.aerosecure.entity.ComplianceRecord;
import com.aerosecure.entity.User;
import com.aerosecure.enums.ComplianceStatus;
import com.aerosecure.exception.ResourceNotFoundException;
import com.aerosecure.repository.AircraftRepository;
import com.aerosecure.repository.ComplianceRepository;
import com.aerosecure.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ComplianceService {

    private final ComplianceRepository complianceRepository;
    private final AircraftRepository aircraftRepository;
    private final UserRepository userRepository;

    public ComplianceService(ComplianceRepository complianceRepository,
                             AircraftRepository aircraftRepository,
                             UserRepository userRepository) {
        this.complianceRepository = complianceRepository;
        this.aircraftRepository = aircraftRepository;
        this.userRepository = userRepository;
    }

    public Page<ComplianceRecord> getAllRecords(String status, Long aircraftId, Pageable pageable) {
        ComplianceStatus complianceStatus = null;
        if (status != null && !status.isEmpty()) {
            complianceStatus = ComplianceStatus.valueOf(status.toUpperCase());
        }
        return complianceRepository.findWithFilters(complianceStatus, aircraftId, pageable);
    }

    public ComplianceRecord getRecordById(Long id) {
        return complianceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance Record", id));
    }

    public ComplianceRecord createRecord(ComplianceRequest request) {
        Aircraft aircraft = aircraftRepository.findById(request.getAircraftId())
                .orElseThrow(() -> new ResourceNotFoundException("Aircraft", request.getAircraftId()));

        ComplianceRecord record = new ComplianceRecord();
        record.setAircraft(aircraft);
        record.setAuditDate(LocalDate.parse(request.getAuditDate()));
        record.setRegulationType(request.getRegulationType());
        record.setFindings(request.getFindings());
        record.setRemarks(request.getRemarks());

        if (request.getComplianceStatus() != null) {
            record.setComplianceStatus(ComplianceStatus.valueOf(request.getComplianceStatus().toUpperCase()));
        }
        if (request.getNextAuditDate() != null && !request.getNextAuditDate().isEmpty()) {
            record.setNextAuditDate(LocalDate.parse(request.getNextAuditDate()));
        }
        if (request.getAuditorId() != null) {
            User auditor = userRepository.findById(request.getAuditorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Auditor", request.getAuditorId()));
            record.setAuditor(auditor);
        }

        return complianceRepository.save(record);
    }

    public ComplianceRecord updateRecord(Long id, ComplianceRequest request) {
        ComplianceRecord record = getRecordById(id);

        if (request.getAuditDate() != null) {
            record.setAuditDate(LocalDate.parse(request.getAuditDate()));
        }
        if (request.getRegulationType() != null) {
            record.setRegulationType(request.getRegulationType());
        }
        if (request.getComplianceStatus() != null) {
            record.setComplianceStatus(ComplianceStatus.valueOf(request.getComplianceStatus().toUpperCase()));
        }
        if (request.getFindings() != null) {
            record.setFindings(request.getFindings());
        }
        if (request.getRemarks() != null) {
            record.setRemarks(request.getRemarks());
        }
        if (request.getNextAuditDate() != null && !request.getNextAuditDate().isEmpty()) {
            record.setNextAuditDate(LocalDate.parse(request.getNextAuditDate()));
        }

        return complianceRepository.save(record);
    }

    public List<ComplianceRecord> getNonCompliantRecords() {
        return complianceRepository.findByComplianceStatus(ComplianceStatus.NON_COMPLIANT);
    }

    public long countByStatus(ComplianceStatus status) {
        return complianceRepository.countByComplianceStatus(status);
    }

    public long countTotal() {
        return complianceRepository.count();
    }

    public double calculateComplianceScore(Long aircraftId) {
        long compliant = complianceRepository.countCompliantByAircraft(aircraftId);
        long total = complianceRepository.countTotalByAircraft(aircraftId);
        if (total == 0) return 100.0;
        return Math.round((double) compliant / total * 10000.0) / 100.0;
    }
}
