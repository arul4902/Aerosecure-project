package com.aerosecure.repository;

import com.aerosecure.entity.SparePart;
import com.aerosecure.enums.PartStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    Optional<SparePart> findByPartId(String partId);
    List<SparePart> findByStatus(PartStatus status);
    List<SparePart> findByCategory(String category);
    long countByStatus(PartStatus status);

    @Query("SELECT s FROM SparePart s WHERE s.quantity <= s.minStockLevel")
    List<SparePart> findLowStockParts();

    @Query("SELECT s FROM SparePart s WHERE " +
           "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.partId) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR s.status = :status)")
    Page<SparePart> findWithFilters(@Param("search") String search,
                                    @Param("status") PartStatus status,
                                    Pageable pageable);
}
