package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.OtpRequest;
import com.example.demo.dto.ResetPasswordRequest;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
    @PostMapping("/login")
    public String loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest);
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
//    @PostMapping("/login")
//    public String loginUser(@RequestParam String email, @RequestParam String password) {
//        return userService.loginUser(email, password);
//    }
//
//    @PostMapping("/sendOtp")
//    public String sendOtp(@RequestParam String email) {
//        return userService.sendOtp(email);
//    }
//
//    @PostMapping("/verifyOtp")
//    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
//        return userService.verifyOtp(email, otp);
//    }
}
