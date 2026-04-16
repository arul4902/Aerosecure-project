package com.aerosecure.init;

import com.aerosecure.entity.*;
import com.aerosecure.enums.*;
import com.aerosecure.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AircraftRepository aircraftRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final SparePartRepository sparePartRepository;
    private final ComplianceRepository complianceRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, AircraftRepository aircraftRepository,
                           MaintenanceRepository maintenanceRepository, SparePartRepository sparePartRepository,
                           ComplianceRepository complianceRepository, ReportRepository reportRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.aircraftRepository = aircraftRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.sparePartRepository = sparePartRepository;
        this.complianceRepository = complianceRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // === USERS ===
        User admin = new User("admin", "admin@aerosecure.com",
                passwordEncoder.encode("admin123"), "John Administrator", UserRole.ADMIN);
        User engineer1 = new User("engineer1", "mike@aerosecure.com",
                passwordEncoder.encode("eng123"), "Mike Thompson", UserRole.ENGINEER);
        User engineer2 = new User("engineer2", "sarah@aerosecure.com",
                passwordEncoder.encode("eng123"), "Sarah Chen", UserRole.ENGINEER);
        User engineer3 = new User("engineer3", "raj@aerosecure.com",
                passwordEncoder.encode("eng123"), "Raj Patel", UserRole.ENGINEER);
        User manager = new User("manager", "manager@aerosecure.com",
                passwordEncoder.encode("mgr123"), "Emily Davis", UserRole.MANAGER);
        User manager2 = new User("manager2", "james@aerosecure.com",
                passwordEncoder.encode("mgr123"), "James Wilson", UserRole.MANAGER);

        userRepository.save(admin);
        userRepository.save(engineer1);
        userRepository.save(engineer2);
        userRepository.save(engineer3);
        userRepository.save(manager);
        userRepository.save(manager2);

        // === AIRCRAFT ===
        Aircraft a1 = new Aircraft("AC-001", "Boeing 737-800", "Boeing", "SN-38291", 2018, 12500.0, AircraftStatus.ACTIVE, "AeroSecure Airlines");
        Aircraft a2 = new Aircraft("AC-002", "Airbus A320neo", "Airbus", "SN-45672", 2020, 8200.0, AircraftStatus.ACTIVE, "AeroSecure Airlines");
        Aircraft a3 = new Aircraft("AC-003", "Boeing 787-9", "Boeing", "SN-78341", 2019, 15800.0, AircraftStatus.UNDER_MAINTENANCE, "AeroSecure Airlines");
        Aircraft a4 = new Aircraft("AC-004", "Airbus A350-900", "Airbus", "SN-92104", 2021, 5400.0, AircraftStatus.ACTIVE, "SkyWing Corp");
        Aircraft a5 = new Aircraft("AC-005", "Boeing 777-300ER", "Boeing", "SN-11287", 2015, 28000.0, AircraftStatus.ACTIVE, "SkyWing Corp");
        Aircraft a6 = new Aircraft("AC-006", "Embraer E195-E2", "Embraer", "SN-33450", 2022, 3200.0, AircraftStatus.ACTIVE, "AeroSecure Airlines");
        Aircraft a7 = new Aircraft("AC-007", "Boeing 747-8", "Boeing", "SN-55781", 2012, 42000.0, AircraftStatus.RETIRED, "Global Air");
        Aircraft a8 = new Aircraft("AC-008", "Airbus A330-300", "Airbus", "SN-67234", 2017, 18900.0, AircraftStatus.ACTIVE, "Global Air");
        Aircraft a9 = new Aircraft("AC-009", "Bombardier CRJ-900", "Bombardier", "SN-22198", 2019, 9800.0, AircraftStatus.UNDER_MAINTENANCE, "AeroSecure Airlines");
        Aircraft a10 = new Aircraft("AC-010", "Boeing 737 MAX 8", "Boeing", "SN-44556", 2023, 2100.0, AircraftStatus.ACTIVE, "SkyWing Corp");
        Aircraft a11 = new Aircraft("AC-011", "Airbus A321XLR", "Airbus", "SN-88912", 2024, 800.0, AircraftStatus.ACTIVE, "AeroSecure Airlines");
        Aircraft a12 = new Aircraft("AC-012", "Boeing 767-300F", "Boeing", "SN-19834", 2014, 35000.0, AircraftStatus.ACTIVE, "Global Air");

        a1.setLastMaintenance(LocalDateTime.now().minusDays(30));
        a2.setLastMaintenance(LocalDateTime.now().minusDays(15));
        a3.setLastMaintenance(LocalDateTime.now().minusDays(2));
        a5.setLastMaintenance(LocalDateTime.now().minusDays(45));
        a8.setLastMaintenance(LocalDateTime.now().minusDays(60));

        aircraftRepository.save(a1); aircraftRepository.save(a2); aircraftRepository.save(a3);
        aircraftRepository.save(a4); aircraftRepository.save(a5); aircraftRepository.save(a6);
        aircraftRepository.save(a7); aircraftRepository.save(a8); aircraftRepository.save(a9);
        aircraftRepository.save(a10); aircraftRepository.save(a11); aircraftRepository.save(a12);

        // === MAINTENANCE SCHEDULES ===
        createMaintenance(a1, engineer1, "Engine oil change and filter replacement", Priority.MEDIUM, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(30), LocalDate.now().minusDays(28), 8, 7, "Completed on schedule");
        createMaintenance(a1, engineer2, "Landing gear inspection", Priority.HIGH, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(20), LocalDate.now().minusDays(18), 12, 14, "Minor wear detected");
        createMaintenance(a2, engineer1, "Avionics system calibration", Priority.MEDIUM, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(15), LocalDate.now().minusDays(14), 6, 5, "All systems nominal");
        createMaintenance(a3, engineer3, "Wing structural inspection - C-Check", Priority.CRITICAL, TaskStatus.IN_PROGRESS,
                LocalDate.now().minusDays(2), null, 48, null, "Major inspection in progress");
        createMaintenance(a3, engineer1, "Hydraulic system overhaul", Priority.HIGH, TaskStatus.IN_PROGRESS,
                LocalDate.now().minusDays(1), null, 24, null, "Replacing hydraulic actuators");
        createMaintenance(a4, engineer2, "APU maintenance check", Priority.LOW, TaskStatus.PLANNED,
                LocalDate.now().plusDays(5), null, 4, null, "Routine APU inspection");
        createMaintenance(a5, engineer3, "Engine borescope inspection", Priority.HIGH, TaskStatus.PLANNED,
                LocalDate.now().plusDays(3), null, 16, null, "Required after 25,000 flight hours");
        createMaintenance(a5, engineer1, "Cabin pressurization test", Priority.MEDIUM, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(45), LocalDate.now().minusDays(44), 4, 4, "All within limits");
        createMaintenance(a6, null, "Tire replacement - Main gear", Priority.MEDIUM, TaskStatus.PLANNED,
                LocalDate.now().plusDays(10), null, 3, null, "Tires approaching wear limits");
        createMaintenance(a8, engineer2, "Navigation system update", Priority.LOW, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(60), LocalDate.now().minusDays(59), 8, 7, "Software updated to v4.2");
        createMaintenance(a9, engineer3, "Fuel system leak repair", Priority.CRITICAL, TaskStatus.IN_PROGRESS,
                LocalDate.now(), null, 20, null, "Fuel leak detected during preflight");
        createMaintenance(a10, null, "Initial 500-hour inspection", Priority.MEDIUM, TaskStatus.PLANNED,
                LocalDate.now().plusDays(15), null, 10, null, "First major inspection for new aircraft");
        createMaintenance(a1, engineer1, "Brake system inspection", Priority.HIGH, TaskStatus.PLANNED,
                LocalDate.now().plusDays(7), null, 6, null, "Scheduled brake pad replacement");
        createMaintenance(a2, null, "Weather radar calibration", Priority.LOW, TaskStatus.PLANNED,
                LocalDate.now().plusDays(20), null, 4, null, "Annual radar calibration");
        createMaintenance(a12, engineer2, "Cargo door mechanism service", Priority.HIGH, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(10), LocalDate.now().minusDays(8), 12, 15, "Door actuator replaced");
        createMaintenance(a8, engineer1, "Flight control computer replacement", Priority.CRITICAL, TaskStatus.PLANNED,
                LocalDate.now().plusDays(2), null, 18, null, "FCC showing intermittent faults");
        createMaintenance(a4, engineer3, "Oxygen system inspection", Priority.MEDIUM, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(25), LocalDate.now().minusDays(24), 5, 5, "All masks functional");
        createMaintenance(a11, engineer1, "Initial A-Check", Priority.HIGH, TaskStatus.PLANNED,
                LocalDate.now().plusDays(8), null, 24, null, "First A-Check for new aircraft");
        createMaintenance(a6, engineer2, "Engine vibration analysis", Priority.MEDIUM, TaskStatus.COMPLETED,
                LocalDate.now().minusDays(40), LocalDate.now().minusDays(39), 6, 6, "Within acceptable limits");
        createMaintenance(a5, null, "Interior refurbishment - Business Class", Priority.LOW, TaskStatus.PLANNED,
                LocalDate.now().plusDays(30), null, 40, null, "Seat replacement and IFE upgrade");

        // === SPARE PARTS ===
        sparePartRepository.save(new SparePart("SP-001", "Engine Oil Filter", "Engine", 45, 10, "Pratt & Whitney", 250.0, "Boeing 737, Airbus A320"));
        sparePartRepository.save(new SparePart("SP-002", "Brake Pad Set", "Landing Gear", 28, 8, "Honeywell Aerospace", 1200.0, "All Boeing"));
        sparePartRepository.save(new SparePart("SP-003", "Hydraulic Actuator", "Hydraulics", 5, 3, "Parker Hannifin", 8500.0, "Boeing 787, Airbus A350"));
        sparePartRepository.save(new SparePart("SP-004", "Navigation Antenna", "Avionics", 12, 5, "Collins Aerospace", 3200.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-005", "Cockpit Display Unit", "Avionics", 3, 2, "Thales Group", 15000.0, "Airbus A320, A350"));
        sparePartRepository.save(new SparePart("SP-006", "Tire - Main Gear", "Landing Gear", 20, 6, "Michelin Aviation", 800.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-007", "APU Starter Motor", "Engine", 2, 2, "Honeywell Aerospace", 12000.0, "Boeing 737, 787"));
        sparePartRepository.save(new SparePart("SP-008", "Oxygen Mask Assembly", "Safety", 150, 30, "B/E Aerospace", 85.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-009", "Flight Data Recorder", "Avionics", 4, 2, "L3Harris", 25000.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-010", "Fuel Pump", "Fuel System", 8, 4, "Parker Hannifin", 6500.0, "Boeing 777, 787"));
        sparePartRepository.save(new SparePart("SP-011", "Windshield Panel", "Structural", 6, 3, "PPG Aerospace", 18000.0, "Boeing 737, Airbus A320"));
        sparePartRepository.save(new SparePart("SP-012", "Cabin Air Filter", "Environmental", 60, 15, "Donaldson Aerospace", 120.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-013", "Landing Light Assembly", "Electrical", 15, 5, "GE Aviation", 950.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-014", "Thrust Reverser Actuator", "Engine", 1, 2, "Safran", 35000.0, "Airbus A320neo"));
        sparePartRepository.save(new SparePart("SP-015", "Emergency Slide Raft", "Safety", 8, 4, "Air Cruisers", 22000.0, "Wide-body Aircraft"));
        sparePartRepository.save(new SparePart("SP-016", "Pitot Tube Sensor", "Avionics", 10, 4, "Thales Group", 4500.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-017", "Engine Fan Blade", "Engine", 0, 3, "Rolls-Royce", 45000.0, "Boeing 787"));
        sparePartRepository.save(new SparePart("SP-018", "Weather Radar Module", "Avionics", 4, 2, "Collins Aerospace", 28000.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-019", "Galley Oven Unit", "Cabin", 25, 5, "B/E Aerospace", 2800.0, "All Aircraft"));
        sparePartRepository.save(new SparePart("SP-020", "Fire Extinguisher - Engine", "Safety", 18, 6, "Kidde Aerospace", 1500.0, "All Aircraft"));

        // === COMPLIANCE RECORDS ===
        createCompliance(a1, manager, LocalDate.now().minusDays(90), "FAA", ComplianceStatus.COMPLIANT,
                "All systems passed inspection", "Annual FAA compliance check", LocalDate.now().plusDays(275));
        createCompliance(a1, manager, LocalDate.now().minusDays(60), "EASA", ComplianceStatus.COMPLIANT,
                "Meets EASA Part-M requirements", "Continuing airworthiness review", LocalDate.now().plusDays(305));
        createCompliance(a2, manager, LocalDate.now().minusDays(45), "FAA", ComplianceStatus.COMPLIANT,
                "No findings", "Routine compliance verification", LocalDate.now().plusDays(320));
        createCompliance(a3, manager2, LocalDate.now().minusDays(10), "FAA", ComplianceStatus.NON_COMPLIANT,
                "Hydraulic system pressure below minimum threshold. Wing spar corrosion detected at Station 425.",
                "Critical findings - aircraft grounded", LocalDate.now().plusDays(30));
        createCompliance(a4, manager, LocalDate.now().minusDays(30), "EASA", ComplianceStatus.COMPLIANT,
                "All airworthiness directives complied with", "Scheduled audit", LocalDate.now().plusDays(335));
        createCompliance(a5, manager2, LocalDate.now().minusDays(20), "FAA", ComplianceStatus.COMPLIANT,
                "Engine performance within parameters", "Bi-annual engine compliance", LocalDate.now().plusDays(160));
        createCompliance(a5, manager, LocalDate.now().minusDays(5), "EASA", ComplianceStatus.PENDING,
                "Awaiting engine borescope results", "Pending inspection completion", LocalDate.now().plusDays(25));
        createCompliance(a6, manager, LocalDate.now().minusDays(50), "FAA", ComplianceStatus.COMPLIANT,
                "New aircraft - all initial certifications valid", "Initial compliance verification", LocalDate.now().plusDays(315));
        createCompliance(a8, manager2, LocalDate.now().minusDays(15), "FAA", ComplianceStatus.NON_COMPLIANT,
                "Flight control computer showing intermittent faults. AD 2024-15-06 not yet complied with.",
                "Airworthiness Directive compliance required", LocalDate.now().plusDays(15));
        createCompliance(a9, manager, LocalDate.now().minusDays(3), "FAA", ComplianceStatus.NON_COMPLIANT,
                "Fuel system integrity compromised. Leak detected in wing tank #2.",
                "Emergency compliance review", LocalDate.now().plusDays(10));
        createCompliance(a10, manager2, LocalDate.now().minusDays(40), "FAA", ComplianceStatus.COMPLIANT,
                "All MAX-specific ADs complied with", "MAX return-to-service compliance", LocalDate.now().plusDays(325));
        createCompliance(a11, manager, LocalDate.now().minusDays(25), "EASA", ComplianceStatus.COMPLIANT,
                "New aircraft - EASA Type Certificate validated", "Initial EASA certification", LocalDate.now().plusDays(340));
        createCompliance(a12, manager2, LocalDate.now().minusDays(70), "FAA", ComplianceStatus.COMPLIANT,
                "Cargo aircraft specific requirements met", "Annual freighter compliance", LocalDate.now().plusDays(295));
        createCompliance(a7, manager, LocalDate.now().minusDays(120), "FAA", ComplianceStatus.PENDING,
                "Retirement documentation under review", "Final decommission compliance", null);

        // === MAINTENANCE REPORTS ===
        createReport(a1, "Monthly", 1785.7, 21.0, 100.0, 2, 3, 30);
        createReport(a2, "Monthly", 2733.3, 5.0, 100.0, 1, 1, 30);
        createReport(a3, "Monthly", 0.0, 72.0, 0.0, 0, 5, 30);
        createReport(a5, "Monthly", 3500.0, 4.0, 66.7, 2, 2, 30);
        createReport(a8, "Monthly", 2700.0, 7.0, 50.0, 1, 1, 30);
        createReport(a1, "Quarterly", 1562.5, 25.0, 100.0, 4, 8, 90);
        createReport(a5, "Quarterly", 2800.0, 48.0, 75.0, 5, 6, 90);
        createReport(a12, "Monthly", 4375.0, 15.0, 100.0, 1, 2, 30);

        System.out.println("=== AeroSecure Sample Data Initialized ===");
        System.out.println("Users: " + userRepository.count());
        System.out.println("Aircraft: " + aircraftRepository.count());
        System.out.println("Maintenance Schedules: " + maintenanceRepository.count());
        System.out.println("Spare Parts: " + sparePartRepository.count());
        System.out.println("Compliance Records: " + complianceRepository.count());
        System.out.println("Reports: " + reportRepository.count());
        System.out.println("==========================================");
        System.out.println("Login Credentials:");
        System.out.println("  Admin:    admin / admin123");
        System.out.println("  Engineer: engineer1 / eng123");
        System.out.println("  Manager:  manager / mgr123");
        System.out.println("==========================================");
    }

    private void createMaintenance(Aircraft aircraft, User engineer, String task, Priority priority,
                                    TaskStatus status, LocalDate scheduled, LocalDate completed,
                                    int estimated, Integer actual, String remarks) {
        MaintenanceSchedule m = new MaintenanceSchedule();
        m.setAircraft(aircraft);
        m.setAssignedEngineer(engineer);
        m.setTaskDescription(task);
        m.setPriority(priority);
        m.setStatus(status);
        m.setScheduledDate(scheduled);
        m.setCompletionDate(completed);
        m.setEstimatedHours(estimated);
        m.setActualHours(actual);
        m.setRemarks(remarks);
        maintenanceRepository.save(m);
    }

    private void createCompliance(Aircraft aircraft, User auditor, LocalDate auditDate, String regulation,
                                   ComplianceStatus status, String findings, String remarks, LocalDate nextAudit) {
        ComplianceRecord c = new ComplianceRecord();
        c.setAircraft(aircraft);
        c.setAuditor(auditor);
        c.setAuditDate(auditDate);
        c.setRegulationType(regulation);
        c.setComplianceStatus(status);
        c.setFindings(findings);
        c.setRemarks(remarks);
        c.setNextAuditDate(nextAudit);
        complianceRepository.save(c);
    }

    private void createReport(Aircraft aircraft, String type, double mtbf, double downtime,
                               double compliance, int tasks, int parts, int periodDays) {
        MaintenanceReport r = new MaintenanceReport();
        r.setAircraft(aircraft);
        r.setReportType(type);
        r.setMtbfHours(mtbf);
        r.setDowntimeHours(downtime);
        r.setComplianceScore(compliance);
        r.setTotalTasksCompleted(tasks);
        r.setTotalPartsUsed(parts);
        r.setReportPeriodStart(LocalDate.now().minusDays(periodDays));
        r.setReportPeriodEnd(LocalDate.now());
        reportRepository.save(r);
    }
}
