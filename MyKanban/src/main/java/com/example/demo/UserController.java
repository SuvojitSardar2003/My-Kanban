package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.OtpRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.ResetPasswordRequest;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody RegisterRequest registerRequest) {
        return userService.registerUser(registerRequest);
    }
    @PostMapping("/login") 
    public String loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) { 
    	return userService.loginUser(loginRequest, session); 
    }

    @PostMapping("/sendOtp")
    public String sendOtp(@RequestBody OtpRequest otpRequest) {
        return userService.sendOtp(otpRequest.getEmail());
    }

    @PostMapping("/verifyOtp")
    public String verifyOtp(@RequestBody OtpRequest otpRequest) {
        return userService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());
    }
    
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        return userService.forgotPassword(email);
    }
    
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        return userService.resetPassword(resetPasswordRequest);
    }

}
