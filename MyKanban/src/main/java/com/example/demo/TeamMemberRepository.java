package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    

	List<TeamMember> findByUserId(Long userId);

	

	long countByUserId(Long userId);

	 
}