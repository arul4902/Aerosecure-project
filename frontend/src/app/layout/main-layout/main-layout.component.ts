import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">✈</span>
            <span class="logo-text" *ngIf="!sidebarCollapsed">AeroSecure</span>
          </div>
          <button class="collapse-btn" (click)="sidebarCollapsed = !sidebarCollapsed">
            {{ sidebarCollapsed ? '›' : '‹' }}
          </button>
        </div>

        <div class="user-info" *ngIf="!sidebarCollapsed">
          <div class="user-avatar">{{ getInitials() }}</div>
          <div>
            <div class="user-name">{{ user?.fullName }}</div>
            <div class="user-role badge badge-{{user?.role?.toLowerCase()}}">{{ user?.role }}</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">⊞</span>
            <span class="nav-label" *ngIf="!sidebarCollapsed">Dashboard</span>
          </a>
          <a routerLink="/fleet" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">✈</span>
            <span class="nav-label" *ngIf="!sidebarCollapsed">Fleet Management</span>
          </a>
          <a routerLink="/maintenance" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🔧</span>
            <span class="nav-label" *ngIf="!sidebarCollapsed">Maintenance</span>
          </a>
          <a routerLink="/inventory" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📦</span>
            <span class="nav-label" *ngIf="!sidebarCollapsed">Spare Parts</span>
            <span class="nav-badge" *ngIf="!sidebarCollapsed && lowStockCount > 0">{{ lowStockCount }}</span>
          </a>
          <a routerLink="/compliance" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🛡</span>
            <span class="nav-label" *ngIf="!sidebarCollapsed">Compliance</span>
            <span class="nav-badge danger" *ngIf="!sidebarCollapsed && nonCompliantCount > 0">{{ nonCompliantCount }}</span>
          </a>
          <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            <span class="nav-label" *ngIf="!sidebarCollapsed">Analytics</span>
          </a>
        </nav>

        <div class="sidebar-footer" *ngIf="!sidebarCollapsed">
          <div class="system-tag">Aviation Grade • v1.0.0</div>
        </div>
      </aside>

      <!-- Main content -->
      <div class="main-wrapper">
        <!-- Navbar -->
        <header class="navbar">
          <div class="navbar-left">
            <div class="breadcrumb" *ngIf="!sidebarCollapsed"></div>
          </div>
          <div class="navbar-right">
            <!-- Notifications -->
            <div class="notif-btn" (click)="toggleNotifications()" style="position:relative; cursor:pointer;">
              <span style="font-size:18px;">🔔</span>
              <span class="notif-count" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
            </div>

            <!-- Notification panel -->
            <div class="notif-panel" *ngIf="showNotifications">
              <div class="notif-header">
                <span>Notifications</span>
                <button (click)="notifService.markAllAsRead(); showNotifications=false" class="btn btn-sm btn-secondary">Clear All</button>
              </div>
              <div *ngIf="(notifService.notifications$ | async)?.length === 0" class="empty-state" style="padding:30px">
                <p>No notifications</p>
              </div>
              <div class="notif-item" *ngFor="let n of notifService.notifications$ | async" [class.unread]="!n.read" (click)="notifService.markAsRead(n.id)">
                <div class="notif-title">{{ n.title }}</div>
                <div class="notif-msg">{{ n.message }}</div>
                <div class="notif-time">{{ n.timestamp | date:'short' }}</div>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" (click)="logout()">
              <span>⏻</span> Sign Out
            </button>
          </div>
        </header>

        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>

    <!-- Backdrop for notifications -->
    <div *ngIf="showNotifications" class="notif-backdrop" (click)="showNotifications=false"></div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; overflow: hidden; }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      transition: width 0.25s ease;
      flex-shrink: 0;
      overflow: hidden;
    }
    .sidebar.collapsed { width: 64px; }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 14px;
      border-bottom: 1px solid var(--border);
      min-height: var(--navbar-height);
    }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-icon { font-size: 24px; color: var(--accent); filter: drop-shadow(0 0 8px var(--accent)); }
    .logo-text { font-size: 16px; font-weight: 800; background: linear-gradient(135deg, var(--accent), #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .collapse-btn { background: none; border: 1px solid var(--border); color: var(--text-secondary); border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 16px; transition: all 0.2s; }
    .collapse-btn:hover { border-color: var(--accent); color: var(--accent); }

    .user-info { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--border); }
    .user-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #7c3aed); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: #000; flex-shrink: 0; }
    .user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
    .user-role { font-size: 10px; margin-top: 2px; }
    .badge-admin { background: rgba(0,212,255,0.15); color: var(--accent); }
    .badge-engineer { background: rgba(16,185,129,0.15); color: var(--success); }
    .badge-manager { background: rgba(124,58,237,0.15); color: #a78bfa; }

    .sidebar-nav { flex: 1; overflow-y: auto; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 10px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
      position: relative;
      white-space: nowrap;
    }
    .nav-item:hover { background: var(--bg-card); color: var(--text-primary); }
    .nav-item.active { background: var(--accent-glow); color: var(--accent); border-left: 2px solid var(--accent); }
    .nav-icon { font-size: 18px; width: 22px; text-align: center; flex-shrink: 0; }
    .nav-label { flex: 1; }
    .nav-badge { background: var(--warning); color: #000; border-radius: 10px; padding: 1px 7px; font-size: 10px; font-weight: 700; }
    .nav-badge.danger { background: var(--danger); color: #fff; }

    .sidebar-footer { padding: 12px 16px; border-top: 1px solid var(--border); }
    .system-tag { font-size: 10px; color: var(--text-muted); text-align: center; }

    /* Navbar */
    .navbar {
      height: var(--navbar-height);
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-right { display: flex; align-items: center; gap: 16px; }

    /* Notifications */
    .notif-btn { position: relative; }
    .notif-count { position: absolute; top: -6px; right: -6px; background: var(--danger); color: #fff; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
    .notif-panel { position: absolute; top: calc(var(--navbar-height) - 3px); right: 24px; width: 340px; background: #0d1f35; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); z-index: 200; max-height: 480px; overflow-y: auto; }
    .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--border); font-weight: 600; font-size: 14px; }
    .notif-item { padding: 12px 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s; }
    .notif-item:hover { background: var(--bg-card-hover); }
    .notif-item.unread { background: rgba(0,212,255,0.04); border-left: 2px solid var(--accent); }
    .notif-title { font-size: 13px; font-weight: 600; }
    .notif-msg { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
    .notif-time { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
    .notif-backdrop { position: fixed; inset: 0; z-index: 199; }

    /* Main */
    .main-wrapper { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .content-area { flex: 1; overflow-y: auto; }
  `]
})
export class MainLayoutComponent implements OnInit {
  user: any;
  sidebarCollapsed = false;
  showNotifications = false;
  unreadCount = 0;
  lowStockCount = 0;
  nonCompliantCount = 0;

  constructor(
    public authService: AuthService,
    public notifService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.notifService.notifications$.subscribe(notifs => {
      this.unreadCount = notifs.filter(n => !n.read).length;
    });
  }

  getInitials(): string {
    const name = this.user?.fullName || '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
    this.authService.logout();
  }
}
