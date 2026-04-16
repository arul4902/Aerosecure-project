package com.aerosecure.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SparePartRequest {
    @NotBlank(message = "Part ID is required")
    private String partId;

    @NotBlank(message = "Name is required")
    private String name;

    private String category;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private Integer minStockLevel;
    private String supplier;
    private Double unitPrice;
    private String compatibleAircraft;

    public SparePartRequest() {}

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
    public String getCompatibleAircraft() { return compatibleAircraft; }
    public void setCompatibleAircraft(String compatibleAircraft) { this.compatibleAircraft = compatibleAircraft; }
}
