import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-content fade-in">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Welcome back, {{ user?.fullName?.split(' ')[0] }} 👋</h1>
          <p>{{ getGreeting() }} Here's your operational overview for today.</p>
        </div>
        <div style="display:flex;gap:8px">
          <span class="badge badge-active" style="padding:8px 16px;font-size:13px">🟢 System Operational</span>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading && stats">
        <!-- Aircraft Stats -->
        <div class="section-label">Fleet Status</div>
        <div class="stat-grid">
          <div class="stat-card accent">
            <div class="stat-icon accent">✈</div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalAircraft }}</div>
              <div class="stat-label">Total Aircraft</div>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon success">🟢</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--success)">{{ stats.activeAircraft }}</div>
              <div class="stat-label">Active</div>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon warning">🔧</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--warning)">{{ stats.underMaintenance }}</div>
              <div class="stat-label">Under Maintenance</div>
            </div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon danger">⛔</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--danger)">{{ stats.retiredAircraft }}</div>
              <div class="stat-label">Retired</div>
            </div>
          </div>
        </div>

        <!-- Maintenance & Compliance Stats -->
        <div class="section-label" style="margin-top:8px">Operations & Compliance</div>
        <div class="stat-grid">
          <div class="stat-card accent">
            <div class="stat-icon accent">📋</div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalMaintenanceTasks }}</div>
              <div class="stat-label">Total Tasks</div>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon success">✅</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--success)">{{ stats.completedTasks }}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon warning">⚙</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--warning)">{{ stats.inProgressTasks }}</div>
              <div class="stat-label">In Progress</div>
            </div>
          </div>
          <div class="stat-card purple">
            <div class="stat-icon purple">📊</div>
            <div class="stat-info">
              <div class="stat-value" style="color:#a78bfa">{{ stats.overallComplianceScore }}%</div>
              <div class="stat-label">Compliance Score</div>
            </div>
          </div>
        </div>

        <!-- Inventory & Compliance row -->
        <div class="stat-grid" style="margin-top:0">
          <div class="stat-card warning">
            <div class="stat-icon warning">📦</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--warning)">{{ stats.lowStockParts }}</div>
              <div class="stat-label">Low Stock Alerts</div>
            </div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon danger">🚨</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--danger)">{{ stats.nonCompliantRecords }}</div>
              <div class="stat-label">Non-Compliant</div>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon success">🛡</div>
            <div class="stat-info">
              <div class="stat-value" style="color:var(--success)">{{ stats.compliantRecords }}</div>
              <div class="stat-label">Compliant Audits</div>
            </div>
          </div>
          <div class="stat-card accent">
            <div class="stat-icon accent">📦</div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalSpareParts }}</div>
              <div class="stat-label">Total Parts</div>
            </div>
          </div>
        </div>

        <!-- Bottom panels -->
        <div class="panels-grid">
          <!-- Recent Maintenance -->
          <div class="card">
            <div class="card-header">
              <h3>📋 Recent Maintenance Tasks</h3>
              <a routerLink="/maintenance" class="btn btn-secondary btn-sm">View All</a>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Aircraft</th>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Engineer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let task of stats.recentMaintenanceTasks">
                    <td><strong>{{ task.aircraftId }}</strong></td>
                    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ task.task }}</td>
                    <td><span class="badge badge-{{task.priority?.toLowerCase()}}">{{ task.priority }}</span></td>
                    <td><span class="badge badge-{{task.status?.toLowerCase()}}">{{ task.status }}</span></td>
                    <td>{{ task.engineer }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="empty-state" *ngIf="stats.recentMaintenanceTasks?.length === 0">
              <p>No recent tasks</p>
            </div>
          </div>

          <!-- Alerts panels -->
          <div style="display:flex;flex-direction:column;gap:16px">
            <!-- Low Stock -->
            <div class="card">
              <div class="card-header">
                <h3>⚠ Low Stock Alerts</h3>
                <a routerLink="/inventory" class="btn btn-warning btn-sm">Manage</a>
              </div>
              <div *ngIf="stats.lowStockAlerts?.length === 0" class="empty-state" style="padding:20px">
                <p>✅ All parts well stocked</p>
              </div>
              <div *ngFor="let part of stats.lowStockAlerts?.slice(0,5)" class="alert-row">
                <div class="alert-info">
                  <strong>{{ part.name }}</strong>
                  <span style="color:var(--text-secondary);font-size:12px">{{ part.partId }}</span>
                </div>
                <div style="text-align:right">
                  <span class="badge badge-{{part.status?.toLowerCase()}}">{{ part.quantity }} left</span>
                </div>
              </div>
            </div>

            <!-- Non-Compliance -->
            <div class="card">
              <div class="card-header">
                <h3>🚨 Non-Compliance Alerts</h3>
                <a routerLink="/compliance" class="btn btn-danger btn-sm">Review</a>
              </div>
              <div *ngIf="stats.nonComplianceAlerts?.length === 0" class="empty-state" style="padding:20px">
                <p>✅ All aircraft compliant</p>
              </div>
              <div *ngFor="let c of stats.nonComplianceAlerts?.slice(0,4)" class="alert-row">
                <div class="alert-info">
                  <strong>{{ c.aircraftId }}</strong>
                  <span style="color:var(--text-secondary);font-size:12px">{{ c.regulationType }} • {{ c.auditDate }}</span>
                </div>
                <span class="badge badge-non_compliant">Non-Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }
    .panels-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; margin-top: 16px; }
    .alert-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
    .alert-row:last-child { border-bottom: none; }
    .alert-info { display: flex; flex-direction: column; gap: 2px; }
    @media(max-width:900px){ .panels-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  user: any;
  stats: any;
  loading = true;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.apiService.getDashboard().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.loading = false;
        // Trigger notifications for alerts
        if (this.stats.nonCompliantRecords > 0) {
          this.notifService.addNotification('error', 'Compliance Alert',
            `${this.stats.nonCompliantRecords} aircraft have non-compliance issues requiring immediate attention.`);
        }
        if (this.stats.lowStockParts > 0) {
          this.notifService.addNotification('warning', 'Low Stock Alert',
            `${this.stats.lowStockParts} spare parts are running below minimum stock levels.`);
        }
        if (this.stats.inProgressTasks > 0) {
          this.notifService.addNotification('info', 'Active Maintenance',
            `${this.stats.inProgressTasks} maintenance task(s) currently in progress.`);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning.';
    if (h < 17) return 'Good afternoon.';
    return 'Good evening.';
  }
}
