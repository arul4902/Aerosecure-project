import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <!-- Animated background -->
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>

      <div class="login-wrapper fade-in">
        <!-- Brand -->
        <div class="brand">
          <div class="brand-icon">✈</div>
          <h1 class="brand-name">AeroSecure</h1>
          <p class="brand-tagline">Aircraft Maintenance & Compliance Management</p>
        </div>

        <!-- Login card -->
        <div class="login-card">
          <div class="login-header">
            <h2>Sign In</h2>
            <p>Access your secure operations dashboard</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input class="form-control" type="text" formControlName="username" placeholder="Enter your username" autocomplete="username">
              <div class="form-error" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                Username is required
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div style="position:relative">
                <input class="form-control" [type]="showPassword ? 'text' : 'password'" formControlName="password" placeholder="Enter your password" autocomplete="current-password">
                <button type="button" class="toggle-pwd" (click)="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁' }}</button>
              </div>
              <div class="form-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>

            <div class="alert alert-danger" *ngIf="errorMessage">
              <span>⚠</span> {{ errorMessage }}
            </div>

            <button type="submit" class="btn btn-primary login-btn" [disabled]="loading">
              <span *ngIf="!loading">🔐 Sign In</span>
              <span *ngIf="loading"><span class="spinner-sm"></span> Authenticating...</span>
            </button>
          </form>

          <!-- Demo credentials -->
          <div class="demo-creds">
            <div class="demo-title">Demo Credentials</div>
            <div class="cred-list">
              <div class="cred-item" (click)="fillCreds('admin', 'admin123')">
                <span class="cred-role admin">Admin</span>
                <span class="cred-info">admin / admin123</span>
              </div>
              <div class="cred-item" (click)="fillCreds('engineer1', 'eng123')">
                <span class="cred-role engineer">Engineer</span>
                <span class="cred-info">engineer1 / eng123</span>
              </div>
              <div class="cred-item" (click)="fillCreds('manager', 'mgr123')">
                <span class="cred-role manager">Manager</span>
                <span class="cred-info">manager / mgr123</span>
              </div>
            </div>
          </div>
        </div>

        <div class="login-footer">
          <span>🛡 FAA & EASA Compliant</span>
          <span>🔒 JWT Secured</span>
          <span>✈ AeroSecure v1.0</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      position: relative;
      overflow: hidden;
      padding: 24px;
    }
    .bg-grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .bg-glow {
      position: absolute;
      top: -200px; left: 50%; transform: translateX(-50%);
      width: 800px; height: 600px;
      background: radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .login-wrapper {
      position: relative; z-index: 1;
      width: 100%; max-width: 440px;
      display: flex; flex-direction: column; gap: 24px;
    }
    .brand { text-align: center; }
    .brand-icon { font-size: 52px; filter: drop-shadow(0 0 20px var(--accent)); animation: float 3s ease-in-out infinite; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .brand-name { font-size: 32px; font-weight: 800; background: linear-gradient(135deg, var(--accent), #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-top: 8px; }
    .brand-tagline { font-size: 13px; color: var(--text-secondary); margin-top: 6px; }

    .login-card {
      background: rgba(10, 22, 40, 0.9);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 32px;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), var(--shadow-accent);
    }
    .login-header { margin-bottom: 24px; }
    .login-header h2 { font-size: 20px; font-weight: 700; }
    .login-header p { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }

    .toggle-pwd { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; padding: 4px; }

    .login-btn { width: 100%; justify-content: center; padding: 12px; font-size: 14px; margin-top: 4px; }
    .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.3); border-top-color: #000; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; }

    .demo-creds { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); }
    .demo-title { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }
    .cred-list { display: flex; flex-direction: column; gap: 8px; }
    .cred-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
    .cred-item:hover { background: var(--bg-card-hover); border-color: var(--accent); }
    .cred-role { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .admin { background: rgba(0,212,255,0.15); color: var(--accent); }
    .engineer { background: rgba(16,185,129,0.15); color: var(--success); }
    .manager { background: rgba(124,58,237,0.15); color: #a78bfa; }
    .cred-info { font-size: 12px; color: var(--text-secondary); font-family: monospace; }

    .login-footer { display: flex; justify-content: center; gap: 20px; font-size: 11px; color: var(--text-muted); flex-wrap: wrap; }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  fillCreds(username: string, password: string): void {
    this.loginForm.patchValue({ username, password });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid username or password';
        this.loading = false;
      },
      complete: () => { this.loading = false; }
    });
  }
}
