package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.ProjectTeam;
import com.example.demo.model.TeamMember;
import com.example.demo.model.User;

import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    

	List<TeamMember> findByUserId(Long userId);
	TeamMember findByIdAndProjectId(Long id, Long projectId);
	
	boolean existsByProjectAndUser(ProjectTeam project, User user);
	
	long countByUserId(Long userId);

	List<TeamMember> findByProjectId(Long projectId);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM TeamMember tm WHERE tm.project.id = :projectId")
    void deleteByProjectId(Long projectId); 
}