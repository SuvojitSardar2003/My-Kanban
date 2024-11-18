import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface User {
  username: string;
  email: string;
  password: string;
}

interface OtpRequest {
  email: string;
  otp?: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- Initial Registration Form -->
    <div class="form-container" *ngIf="!isOtpSent">
      <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="registration-form">
        <h2>User Registration</h2>

        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            formControlName="username" 
            placeholder="Enter username"
            [class.error]="username?.invalid && username?.touched">
          <div class="error-message" *ngIf="username?.invalid && username?.touched">
            Username is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            placeholder="Enter email"
            [class.error]="email?.invalid && email?.touched">
          <div class="error-message" *ngIf="email?.invalid && email?.touched">
            <span *ngIf="email?.errors?.['required']">Email is required</span>
            <span *ngIf="email?.errors?.['email']">Please enter a valid email</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input-container">
            <input 
              [type]="showPassword ? 'text' : 'password'" 
              id="password" 
              formControlName="password" 
              placeholder="Enter password"
              [class.error]="password?.invalid && password?.touched">
            <button type="button" class="toggle-password" (click)="togglePasswordVisibility()">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <div class="error-message" *ngIf="password?.invalid && password?.touched">
            <span *ngIf="password?.errors?.['required']">Password is required</span>
            <span *ngIf="password?.errors?.['minlength']">Password must be at least 8 characters</span>
          </div>
        </div>

        <button type="submit" class="submit-btn" [disabled]="registrationForm.invalid || isLoading">
          {{ isLoading ? 'Processing...' : 'Register' }}
        </button>
      </form>
    </div>

    <!-- OTP Verification Form -->
    <div class="form-container" *ngIf="isOtpSent && !isVerified">
      <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()" class="otp-form">
        <h2>OTP Verification</h2>
        <p>Please enter the OTP sent to your email</p>
        
        <div class="form-group">
          <label for="otp">Enter OTP</label>
          <input 
            type="text" 
            id="otp" 
            formControlName="otp" 
            placeholder="Enter OTP"
            [class.error]="otp?.invalid && otp?.touched">
          <div class="error-message" *ngIf="otp?.invalid && otp?.touched">
            OTP is required
          </div>
        </div>

        <button type="submit" class="verify-btn" [disabled]="otpForm.invalid || isLoading">
          {{ isLoading ? 'Verifying...' : 'Verify OTP' }}
        </button>

        <button type="button" class="resend-btn" (click)="resendOtp()" [disabled]="isResendDisabled || isLoading">
          {{ resendCountdown > 0 ? 'Resend OTP in ' + resendCountdown + 's' : 'Resend OTP' }}
        </button>
      </form>
    </div>

    <div class="form-container" *ngIf="isVerified">
      <h2>Registration Successful!</h2>
      <p>Your account has been verified. You can now login.</p>
    </div>
  `,
  styles: [
    `
      .form-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        background-color: white;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      .error-message {
        color: red;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .password-input-container {
        position: relative;
      }
      .toggle-password {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
      }
      input {
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.25rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      input.error {
        border-color: red;
      }
      button {
        width: 100%;
        padding: 0.75rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 0.5rem;
      }
      button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
      .resend-btn {
        background-color: #6c757d;
        margin-top: 1rem;
      }
      h2 {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      p {
        text-align: center;
        margin-bottom: 1rem;
      }
    `
  ]
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  otpForm!: FormGroup;
  isOtpSent: boolean = false;
  isVerified: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  isResendDisabled: boolean = false;
  resendCountdown: number = 0;
  private baseUrl = 'http://localhost:8080/api/user';
  http = inject(HttpClient);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid && !this.isLoading) {
      this.isLoading = true;
      const user: User = {
        username: this.registrationForm.get('username')?.value,
        email: this.registrationForm.get('email')?.value,
        password: this.registrationForm.get('password')?.value
      };

      this.http.post(`${this.baseUrl}/register`, user, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          if (response.includes('already exists') && response.includes('is verified')) {
            alert('User is already registered and verified. Please login.');
          } else if (response.includes('already exists') && response.includes('not verified')) {
            this.isOtpSent = true;
            this.startResendCountdown();
          } else {
            this.isOtpSent = true;
            this.startResendCountdown();
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          alert(error.error || 'Registration failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  verifyOtp() {
    if (this.otpForm.valid && !this.isLoading) {
      this.isLoading = true;
      const otpRequest: OtpRequest = {
        email: this.registrationForm.get('email')?.value,
        otp: this.otpForm.get('otp')?.value
      };

      this.http.post(`${this.baseUrl}/verifyOtp`, otpRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('OTP verification response:', response);
          if (response === 'OTP verified successfully!') {
            this.isVerified = true;
          } else {
            alert(response);
          }
        },
        error: (error) => {
          console.error('OTP verification error:', error);
          alert(error.error || 'OTP verification failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  resendOtp() {
    if (!this.isResendDisabled && !this.isLoading) {
      this.isLoading = true;
      const otpRequest: OtpRequest = {
        email: this.registrationForm.get('email')?.value
      };

      this.http.post(`${this.baseUrl}/sendOtp`, otpRequest, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log('Resend OTP response:', response);
          alert('OTP has been resent to your email.');
          this.startResendCountdown();
        },
        error: (error) => {
          console.error('Resend OTP error:', error);
          alert(error.error || 'Failed to resend OTP. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private startResendCountdown() {
    this.isResendDisabled = true;
    this.resendCountdown = 30; // 30 seconds cooldown
    const timer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.isResendDisabled = false;
        clearInterval(timer);
      }
    }, 1000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Getter methods for form controls
  get username() { return this.registrationForm.get('username'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get otp() { return this.otpForm.get('otp'); }
}