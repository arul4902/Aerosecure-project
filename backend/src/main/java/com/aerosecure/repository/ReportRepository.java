package com.aerosecure.repository;

import com.aerosecure.entity.MaintenanceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<MaintenanceReport, Long> {
    List<MaintenanceReport> findByAircraftId(Long aircraftId);
    List<MaintenanceReport> findByReportType(String reportType);
}
