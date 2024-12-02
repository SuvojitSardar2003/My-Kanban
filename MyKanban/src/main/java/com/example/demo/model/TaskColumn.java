package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "task_columns")
public class TaskColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_board_id", nullable = false)
    private TaskBoard taskBoard;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int position; // Position of the column in the board

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status; // TaskStatus enum (TODO, IN_PROGRESS, REVIEW, DONE)

    @Column(name = "task_limit")
    private Integer taskLimit; // Optional limit on tasks in this column

    private String description;

    @OneToMany(mappedBy = "taskColumn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();

    // Default constructor
    public TaskColumn() {
    }

    // Parameterized constructor
    public TaskColumn(TaskBoard taskBoard, String name, int position, TaskStatus status, Integer taskLimit, String description) {
        this.taskBoard = taskBoard;
        this.name = name;
        this.position = position;
        this.status = status;
        this.taskLimit = taskLimit;
        this.description = description;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaskBoard getTaskBoard() {
        return taskBoard;
    }

    public void setTaskBoard(TaskBoard taskBoard) {
        this.taskBoard = taskBoard;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Integer getTaskLimit() {
        return taskLimit;
    }

    public void setTaskLimit(Integer taskLimit) {
        this.taskLimit = taskLimit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    // toString method
    @Override
    public String toString() {
        return "TaskColumn{" +
                "id=" + id +
                ", taskBoard=" + (taskBoard != null ? taskBoard.getId() : null) +
                ", name='" + name + '\'' +
                ", position=" + position +
                ", status=" + status +
                ", taskLimit=" + taskLimit +
                ", description='" + description + '\'' +
                '}';
    }
}