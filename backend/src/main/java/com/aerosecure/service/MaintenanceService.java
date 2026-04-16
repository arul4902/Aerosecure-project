package com.aerosecure.service;

import com.aerosecure.dto.request.MaintenanceRequest;
import com.aerosecure.entity.Aircraft;
import com.aerosecure.entity.MaintenanceSchedule;
import com.aerosecure.entity.User;
import com.aerosecure.enums.AircraftStatus;
import com.aerosecure.enums.Priority;
import com.aerosecure.enums.TaskStatus;
import com.aerosecure.exception.ResourceNotFoundException;
import com.aerosecure.repository.AircraftRepository;
import com.aerosecure.repository.MaintenanceRepository;
import com.aerosecure.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final AircraftRepository aircraftRepository;
    private final UserRepository userRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository,
                              AircraftRepository aircraftRepository,
                              UserRepository userRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.aircraftRepository = aircraftRepository;
        this.userRepository = userRepository;
    }

    public Page<MaintenanceSchedule> getAllSchedules(String status, Long aircraftId,
                                                     Long engineerId, Pageable pageable) {
        TaskStatus taskStatus = null;
        if (status != null && !status.isEmpty()) {
            taskStatus = TaskStatus.valueOf(status.toUpperCase());
        }
        return maintenanceRepository.findWithFilters(taskStatus, aircraftId, engineerId, pageable);
    }

    public MaintenanceSchedule getScheduleById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance Schedule", id));
    }

    public List<MaintenanceSchedule> getSchedulesByEngineer(Long engineerId) {
        return maintenanceRepository.findByAssignedEngineerId(engineerId);
    }

    public MaintenanceSchedule createSchedule(MaintenanceRequest request) {
        Aircraft aircraft = aircraftRepository.findById(request.getAircraftId())
                .orElseThrow(() -> new ResourceNotFoundException("Aircraft", request.getAircraftId()));

        MaintenanceSchedule schedule = new MaintenanceSchedule();
        schedule.setAircraft(aircraft);
        schedule.setTaskDescription(request.getTaskDescription());
        schedule.setScheduledDate(LocalDate.parse(request.getScheduledDate()));
        schedule.setEstimatedHours(request.getEstimatedHours());
        schedule.setRemarks(request.getRemarks());

        if (request.getPriority() != null) {
            schedule.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        }
        if (request.getAssignedEngineerId() != null) {
            User engineer = userRepository.findById(request.getAssignedEngineerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Engineer", request.getAssignedEngineerId()));
            schedule.setAssignedEngineer(engineer);
        }

        // Set aircraft to under maintenance if task is in progress
        if (request.getStatus() != null && request.getStatus().equals("IN_PROGRESS")) {
            aircraft.setStatus(AircraftStatus.UNDER_MAINTENANCE);
            aircraftRepository.save(aircraft);
        }

        return maintenanceRepository.save(schedule);
    }

    public MaintenanceSchedule updateSchedule(Long id, MaintenanceRequest request) {
        MaintenanceSchedule schedule = getScheduleById(id);

        if (request.getTaskDescription() != null) {
            schedule.setTaskDescription(request.getTaskDescription());
        }
        if (request.getScheduledDate() != null) {
            schedule.setScheduledDate(LocalDate.parse(request.getScheduledDate()));
        }
        if (request.getPriority() != null) {
            schedule.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        }
        if (request.getStatus() != null) {
            TaskStatus newStatus = TaskStatus.valueOf(request.getStatus().toUpperCase());
            schedule.setStatus(newStatus);

            if (newStatus == TaskStatus.COMPLETED) {
                schedule.setCompletionDate(LocalDate.now());
                // Check if aircraft can be set back to ACTIVE
                Aircraft aircraft = schedule.getAircraft();
                aircraft.setLastMaintenance(java.time.LocalDateTime.now());
                aircraftRepository.save(aircraft);
            }
            if (newStatus == TaskStatus.IN_PROGRESS) {
                Aircraft aircraft = schedule.getAircraft();
                aircraft.setStatus(AircraftStatus.UNDER_MAINTENANCE);
                aircraftRepository.save(aircraft);
            }
        }
        if (request.getCompletionDate() != null) {
            schedule.setCompletionDate(LocalDate.parse(request.getCompletionDate()));
        }
        if (request.getEstimatedHours() != null) {
            schedule.setEstimatedHours(request.getEstimatedHours());
        }
        if (request.getActualHours() != null) {
            schedule.setActualHours(request.getActualHours());
        }
        if (request.getRemarks() != null) {
            schedule.setRemarks(request.getRemarks());
        }
        if (request.getAssignedEngineerId() != null) {
            User engineer = userRepository.findById(request.getAssignedEngineerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Engineer", request.getAssignedEngineerId()));
            schedule.setAssignedEngineer(engineer);
        }

        return maintenanceRepository.save(schedule);
    }

    public MaintenanceSchedule assignEngineer(Long scheduleId, Long engineerId) {
        MaintenanceSchedule schedule = getScheduleById(scheduleId);
        User engineer = userRepository.findById(engineerId)
                .orElseThrow(() -> new ResourceNotFoundException("Engineer", engineerId));
        schedule.setAssignedEngineer(engineer);
        return maintenanceRepository.save(schedule);
    }

    public MaintenanceSchedule updateStatus(Long scheduleId, String status) {
        MaintenanceSchedule schedule = getScheduleById(scheduleId);
        TaskStatus newStatus = TaskStatus.valueOf(status.toUpperCase());
        schedule.setStatus(newStatus);

        if (newStatus == TaskStatus.COMPLETED) {
            schedule.setCompletionDate(LocalDate.now());
        }

        return maintenanceRepository.save(schedule);
    }

    public long countByStatus(TaskStatus status) {
        return maintenanceRepository.countByStatus(status);
    }

    public long countTotal() {
        return maintenanceRepository.count();
    }
}
