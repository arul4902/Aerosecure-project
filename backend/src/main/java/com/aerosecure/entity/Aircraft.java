package com.aerosecure.entity;

import com.aerosecure.enums.AircraftStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aircraft")
public class Aircraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aircraft_id", unique = true, nullable = false, length = 20)
    private String aircraftId;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(nullable = false, length = 100)
    private String manufacturer;

    @Column(name = "serial_number", length = 50)
    private String serialNumber;

    @Column(name = "year_manufactured")
    private Integer yearManufactured;

    @Column(name = "total_flight_hours")
    private Double totalFlightHours = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AircraftStatus status = AircraftStatus.ACTIVE;

    @Column(length = 100)
    private String airline;

    @Column(name = "last_maintenance")
    private LocalDateTime lastMaintenance;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Aircraft() {}

    public Aircraft(String aircraftId, String model, String manufacturer, String serialNumber,
                    Integer yearManufactured, Double totalFlightHours, AircraftStatus status, String airline) {
        this.aircraftId = aircraftId;
        this.model = model;
        this.manufacturer = manufacturer;
        this.serialNumber = serialNumber;
        this.yearManufactured = yearManufactured;
        this.totalFlightHours = totalFlightHours;
        this.status = status;
        this.airline = airline;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAircraftId() { return aircraftId; }
    public void setAircraftId(String aircraftId) { this.aircraftId = aircraftId; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public Integer getYearManufactured() { return yearManufactured; }
    public void setYearManufactured(Integer yearManufactured) { this.yearManufactured = yearManufactured; }

    public Double getTotalFlightHours() { return totalFlightHours; }
    public void setTotalFlightHours(Double totalFlightHours) { this.totalFlightHours = totalFlightHours; }

    public AircraftStatus getStatus() { return status; }
    public void setStatus(AircraftStatus status) { this.status = status; }

    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }

    public LocalDateTime getLastMaintenance() { return lastMaintenance; }
    public void setLastMaintenance(LocalDateTime lastMaintenance) { this.lastMaintenance = lastMaintenance; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
