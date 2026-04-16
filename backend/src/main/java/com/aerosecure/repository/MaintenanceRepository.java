package com.aerosecure.repository;

import com.aerosecure.entity.MaintenanceSchedule;
import com.aerosecure.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceSchedule, Long> {
    List<MaintenanceSchedule> findByAircraftId(Long aircraftId);
    List<MaintenanceSchedule> findByAssignedEngineerId(Long engineerId);
    List<MaintenanceSchedule> findByStatus(TaskStatus status);
    long countByStatus(TaskStatus status);

    @Query("SELECT m FROM MaintenanceSchedule m WHERE " +
           "(:status IS NULL OR m.status = :status) " +
           "AND (:aircraftId IS NULL OR m.aircraft.id = :aircraftId) " +
           "AND (:engineerId IS NULL OR m.assignedEngineer.id = :engineerId)")
    Page<MaintenanceSchedule> findWithFilters(@Param("status") TaskStatus status,
                                              @Param("aircraftId") Long aircraftId,
                                              @Param("engineerId") Long engineerId,
                                              Pageable pageable);

    @Query("SELECT COUNT(m) FROM MaintenanceSchedule m WHERE m.aircraft.id = :aircraftId AND m.status = 'COMPLETED'")
    long countCompletedByAircraft(@Param("aircraftId") Long aircraftId);

    @Query("SELECT COALESCE(SUM(m.actualHours), 0) FROM MaintenanceSchedule m WHERE m.aircraft.id = :aircraftId AND m.status = 'COMPLETED'")
    double sumActualHoursByAircraft(@Param("aircraftId") Long aircraftId);
}
