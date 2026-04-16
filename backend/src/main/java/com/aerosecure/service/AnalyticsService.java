package com.aerosecure.service;

import com.aerosecure.dto.response.DashboardResponse;
import com.aerosecure.entity.Aircraft;
import com.aerosecure.entity.ComplianceRecord;
import com.aerosecure.entity.MaintenanceSchedule;
import com.aerosecure.entity.SparePart;
import com.aerosecure.enums.*;
import com.aerosecure.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AircraftRepository aircraftRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final SparePartRepository sparePartRepository;
    private final ComplianceRepository complianceRepository;
    private final ReportRepository reportRepository;

    public AnalyticsService(AircraftRepository aircraftRepository,
                            MaintenanceRepository maintenanceRepository,
                            SparePartRepository sparePartRepository,
                            ComplianceRepository complianceRepository,
                            ReportRepository reportRepository) {
        this.aircraftRepository = aircraftRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.sparePartRepository = sparePartRepository;
        this.complianceRepository = complianceRepository;
        this.reportRepository = reportRepository;
    }

    public DashboardResponse getDashboardStats() {
        DashboardResponse dashboard = new DashboardResponse();

        // Aircraft stats
        dashboard.setTotalAircraft(aircraftRepository.count());
        dashboard.setActiveAircraft(aircraftRepository.countByStatus(AircraftStatus.ACTIVE));
        dashboard.setUnderMaintenance(aircraftRepository.countByStatus(AircraftStatus.UNDER_MAINTENANCE));
        dashboard.setRetiredAircraft(aircraftRepository.countByStatus(AircraftStatus.RETIRED));

        // Maintenance stats
        dashboard.setTotalMaintenanceTasks(maintenanceRepository.count());
        dashboard.setPlannedTasks(maintenanceRepository.countByStatus(TaskStatus.PLANNED));
        dashboard.setInProgressTasks(maintenanceRepository.countByStatus(TaskStatus.IN_PROGRESS));
        dashboard.setCompletedTasks(maintenanceRepository.countByStatus(TaskStatus.COMPLETED));

        // Parts stats
        dashboard.setTotalSpareParts(sparePartRepository.count());
        dashboard.setLowStockParts(sparePartRepository.countByStatus(PartStatus.LOW_STOCK));
        dashboard.setOutOfStockParts(sparePartRepository.countByStatus(PartStatus.OUT_OF_STOCK));

        // Compliance stats
        dashboard.setTotalComplianceRecords(complianceRepository.count());
        dashboard.setCompliantRecords(complianceRepository.countByComplianceStatus(ComplianceStatus.COMPLIANT));
        dashboard.setNonCompliantRecords(complianceRepository.countByComplianceStatus(ComplianceStatus.NON_COMPLIANT));
        dashboard.setPendingRecords(complianceRepository.countByComplianceStatus(ComplianceStatus.PENDING));

        // Overall compliance score
        long totalCompliance = complianceRepository.count();
        long compliant = complianceRepository.countByComplianceStatus(ComplianceStatus.COMPLIANT);
        dashboard.setOverallComplianceScore(totalCompliance > 0 ?
                Math.round((double) compliant / totalCompliance * 10000.0) / 100.0 : 100.0);

        // Recent maintenance tasks
        List<Map<String, Object>> recentTasks = maintenanceRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::mapMaintenanceToSummary)
                .collect(Collectors.toList());
        dashboard.setRecentMaintenanceTasks(recentTasks);

        // Low stock alerts
        List<Map<String, Object>> lowStockAlerts = sparePartRepository.findLowStockParts().stream()
                .map(this::mapPartToAlert)
                .collect(Collectors.toList());
        dashboard.setLowStockAlerts(lowStockAlerts);

        // Non-compliance alerts
        List<Map<String, Object>> nonCompliance = complianceRepository
                .findByComplianceStatus(ComplianceStatus.NON_COMPLIANT).stream()
                .map(this::mapComplianceToAlert)
                .collect(Collectors.toList());
        dashboard.setNonComplianceAlerts(nonCompliance);

        return dashboard;
    }

    public List<Map<String, Object>> getMtbfData() {
        List<Aircraft> aircraft = aircraftRepository.findAll();
        return aircraft.stream().map(a -> {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("aircraftId", a.getAircraftId());
            data.put("model", a.getModel());
            data.put("totalFlightHours", a.getTotalFlightHours());

            long completedTasks = maintenanceRepository.countCompletedByAircraft(a.getId());
            double mtbf = completedTasks > 0 ?
                    a.getTotalFlightHours() / completedTasks : a.getTotalFlightHours();
            data.put("completedTasks", completedTasks);
            data.put("mtbf", Math.round(mtbf * 100.0) / 100.0);
            return data;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getDowntimeData() {
        List<Aircraft> aircraft = aircraftRepository.findAll();
        return aircraft.stream().map(a -> {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("aircraftId", a.getAircraftId());
            data.put("model", a.getModel());

            double totalDowntime = maintenanceRepository.sumActualHoursByAircraft(a.getId());
            data.put("downtimeHours", totalDowntime);
            data.put("status", a.getStatus().name());

            // Calculate availability percentage
            double availability = a.getTotalFlightHours() > 0 ?
                    ((a.getTotalFlightHours() - totalDowntime) / a.getTotalFlightHours()) * 100 : 100;
            data.put("availabilityPercent", Math.round(Math.max(0, availability) * 100.0) / 100.0);
            return data;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getComplianceScoreData() {
        List<Aircraft> aircraft = aircraftRepository.findAll();
        return aircraft.stream().map(a -> {
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("aircraftId", a.getAircraftId());
            data.put("model", a.getModel());

            long compliantCount = complianceRepository.countCompliantByAircraft(a.getId());
            long totalCount = complianceRepository.countTotalByAircraft(a.getId());
            double score = totalCount > 0 ? (double) compliantCount / totalCount * 100 : 100;
            data.put("compliantAudits", compliantCount);
            data.put("totalAudits", totalCount);
            data.put("complianceScore", Math.round(score * 100.0) / 100.0);
            return data;
        }).collect(Collectors.toList());
    }

    public String exportToCsv(String type) {
        StringBuilder csv = new StringBuilder();

        switch (type.toLowerCase()) {
            case "aircraft":
                csv.append("Aircraft ID,Model,Manufacturer,Status,Flight Hours,Airline\n");
                aircraftRepository.findAll().forEach(a ->
                        csv.append(String.format("%s,%s,%s,%s,%.1f,%s\n",
                                a.getAircraftId(), a.getModel(), a.getManufacturer(),
                                a.getStatus(), a.getTotalFlightHours(), a.getAirline())));
                break;
            case "maintenance":
                csv.append("ID,Aircraft,Task,Priority,Status,Scheduled Date,Engineer\n");
                maintenanceRepository.findAll().forEach(m ->
                        csv.append(String.format("%d,%s,%s,%s,%s,%s,%s\n",
                                m.getId(), m.getAircraft().getAircraftId(), m.getTaskDescription(),
                                m.getPriority(), m.getStatus(), m.getScheduledDate(),
                                m.getAssignedEngineer() != null ? m.getAssignedEngineer().getFullName() : "Unassigned")));
                break;
            case "parts":
                csv.append("Part ID,Name,Category,Quantity,Min Stock,Supplier,Unit Price,Status\n");
                sparePartRepository.findAll().forEach(p ->
                        csv.append(String.format("%s,%s,%s,%d,%d,%s,%.2f,%s\n",
                                p.getPartId(), p.getName(), p.getCategory(), p.getQuantity(),
                                p.getMinStockLevel(), p.getSupplier(), p.getUnitPrice(), p.getStatus())));
                break;
            case "compliance":
                csv.append("ID,Aircraft,Audit Date,Regulation,Status,Findings\n");
                complianceRepository.findAll().forEach(c ->
                        csv.append(String.format("%d,%s,%s,%s,%s,%s\n",
                                c.getId(), c.getAircraft().getAircraftId(), c.getAuditDate(),
                                c.getRegulationType(), c.getComplianceStatus(), c.getFindings())));
                break;
            default:
                csv.append("Invalid export type");
        }

        return csv.toString();
    }

    private Map<String, Object> mapMaintenanceToSummary(MaintenanceSchedule m) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", m.getId());
        map.put("aircraftId", m.getAircraft().getAircraftId());
        map.put("task", m.getTaskDescription());
        map.put("priority", m.getPriority().name());
        map.put("status", m.getStatus().name());
        map.put("scheduledDate", m.getScheduledDate().toString());
        map.put("engineer", m.getAssignedEngineer() != null ? m.getAssignedEngineer().getFullName() : "Unassigned");
        return map;
    }

    private Map<String, Object> mapPartToAlert(SparePart p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("partId", p.getPartId());
        map.put("name", p.getName());
        map.put("quantity", p.getQuantity());
        map.put("minStockLevel", p.getMinStockLevel());
        map.put("status", p.getStatus().name());
        return map;
    }

    private Map<String, Object> mapComplianceToAlert(ComplianceRecord c) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", c.getId());
        map.put("aircraftId", c.getAircraft().getAircraftId());
        map.put("auditDate", c.getAuditDate().toString());
        map.put("findings", c.getFindings());
        map.put("regulationType", c.getRegulationType());
        return map;
    }
}
