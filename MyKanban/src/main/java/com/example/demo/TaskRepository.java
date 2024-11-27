package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    long countByAssignedToIdAndStatus(Long userId, String status);
	long countByAssignedToId(Long userId);
}
