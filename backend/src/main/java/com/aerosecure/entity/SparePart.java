package com.aerosecure.entity;

import com.aerosecure.enums.PartStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "spare_part")
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "part_id", unique = true, nullable = false, length = 20)
    private String partId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String category;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(name = "min_stock_level")
    private Integer minStockLevel = 5;

    @Column(length = 100)
    private String supplier;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartStatus status = PartStatus.IN_STOCK;

    @Column(name = "compatible_aircraft", length = 200)
    private String compatibleAircraft;

    @Column(name = "last_ordered")
    private LocalDateTime lastOrdered;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public SparePart() {}

    public SparePart(String partId, String name, String category, Integer quantity, Integer minStockLevel,
                     String supplier, Double unitPrice, String compatibleAircraft) {
        this.partId = partId;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.minStockLevel = minStockLevel;
        this.supplier = supplier;
        this.unitPrice = unitPrice;
        this.compatibleAircraft = compatibleAircraft;
        this.status = quantity <= 0 ? PartStatus.OUT_OF_STOCK : (quantity <= minStockLevel ? PartStatus.LOW_STOCK : PartStatus.IN_STOCK);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPartId() { return partId; }
    public void setPartId(String partId) { this.partId = partId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public PartStatus getStatus() { return status; }
    public void setStatus(PartStatus status) { this.status = status; }

    public String getCompatibleAircraft() { return compatibleAircraft; }
    public void setCompatibleAircraft(String compatibleAircraft) { this.compatibleAircraft = compatibleAircraft; }

    public LocalDateTime getLastOrdered() { return lastOrdered; }
    public void setLastOrdered(LocalDateTime lastOrdered) { this.lastOrdered = lastOrdered; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
