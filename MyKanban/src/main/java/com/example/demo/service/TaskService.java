package com.example.demo.service;

import com.example.demo.dto.TaskCreateDTO;
import com.example.demo.dto.TaskDTO;
import com.example.demo.model.ProjectTeam;
import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.ProjectTeamRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Task createTask(TaskCreateDTO taskCreateDTO, Long createdByUserId) {
        // Fetch the user who is creating the task
        User createdBy = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch the project the task belongs to
        ProjectTeam project = projectTeamRepository.findById(taskCreateDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Fetch the user the task is assigned to, if any
        User assignedTo = null;
        if (taskCreateDTO.getAssignedToId() != null) {
            assignedTo = userRepository.findById(taskCreateDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        }

        // Create a new Task entity
        Task task = new Task(
                project,
                assignedTo,
                taskCreateDTO.getTitle(),
                taskCreateDTO.getStatus(),
                taskCreateDTO.getDueDate(),
                taskCreateDTO.getPriority(),
                createdBy,
                LocalDateTime.now(),
                taskCreateDTO.getCategory(),
                taskCreateDTO.getDescription()
        );

        // Save the task in the database
        return taskRepository.save(task);
    }

    public TaskDTO convertToDTO(Task task) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(task.getId());
        taskDTO.setTitle(task.getTitle());
        taskDTO.setStatus(task.getStatus());
        taskDTO.setDueDate(task.getDueDate());
        taskDTO.setPriority(task.getPriority());
        taskDTO.setCategory(task.getCategory());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setCreatedAt(task.getCreatedAt());
        taskDTO.setUpdatedAt(task.getUpdatedAt());

        // Set project details
        taskDTO.setProjectId(task.getProject().getId());

        // Set assigned user details
        if (task.getAssignedTo() != null) {
            taskDTO.setAssignedToId(task.getAssignedTo().getId());
        }

        // Set creator details
        taskDTO.setCreatedBy(task.getCreatedBy().getId());

        return taskDTO;
    }
}
