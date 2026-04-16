package com.aerosecure.repository;

import com.aerosecure.entity.Aircraft;
import com.aerosecure.enums.AircraftStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AircraftRepository extends JpaRepository<Aircraft, Long> {
    Optional<Aircraft> findByAircraftId(String aircraftId);
    List<Aircraft> findByStatus(AircraftStatus status);
    List<Aircraft> findByAirline(String airline);
    long countByStatus(AircraftStatus status);

    @Query("SELECT a FROM Aircraft a WHERE " +
           "(:search IS NULL OR LOWER(a.aircraftId) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.model) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.manufacturer) LIKE LOWER(CONCAT('%', :search, '%')))" +
           "AND (:status IS NULL OR a.status = :status)")
    Page<Aircraft> findWithFilters(@Param("search") String search,
                                   @Param("status") AircraftStatus status,
                                   Pageable pageable);
}
