package com.aerosecure.repository;

import com.aerosecure.entity.ComplianceRecord;
import com.aerosecure.enums.ComplianceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplianceRepository extends JpaRepository<ComplianceRecord, Long> {
    List<ComplianceRecord> findByAircraftId(Long aircraftId);
    List<ComplianceRecord> findByComplianceStatus(ComplianceStatus status);
    long countByComplianceStatus(ComplianceStatus status);

    @Query("SELECT c FROM ComplianceRecord c WHERE " +
           "(:status IS NULL OR c.complianceStatus = :status) " +
           "AND (:aircraftId IS NULL OR c.aircraft.id = :aircraftId)")
    Page<ComplianceRecord> findWithFilters(@Param("status") ComplianceStatus status,
                                           @Param("aircraftId") Long aircraftId,
                                           Pageable pageable);

    @Query("SELECT COUNT(c) FROM ComplianceRecord c WHERE c.aircraft.id = :aircraftId AND c.complianceStatus = 'COMPLIANT'")
    long countCompliantByAircraft(@Param("aircraftId") Long aircraftId);

    @Query("SELECT COUNT(c) FROM ComplianceRecord c WHERE c.aircraft.id = :aircraftId")
    long countTotalByAircraft(@Param("aircraftId") Long aircraftId);
}
