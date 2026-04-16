import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>🔧 Maintenance Scheduling</h1>
          <p>Track and manage all aircraft maintenance tasks</p>
        </div>
        <a routerLink="/maintenance/new" class="btn btn-primary" *ngIf="canCreate">＋ New Schedule</a>
      </div>

      <div class="card" style="margin-bottom:16px;padding:14px 20px">
        <div class="filter-bar">
          <select class="form-control filter-select" [(ngModel)]="statusFilter" (ngModelChange)="loadData()">
            <option value="">All Status</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button class="btn btn-secondary btn-sm" (click)="statusFilter='';loadData()">Clear</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div class="card" *ngIf="!loading">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Aircraft</th><th>Task</th><th>Priority</th>
                <th>Status</th><th>Scheduled</th><th>Engineer</th><th>Est. Hrs</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of schedules">
                <td style="color:var(--text-muted)">#{{ m.id }}</td>
                <td><strong style="color:var(--accent)">{{ m.aircraft?.aircraftId }}</strong></td>
                <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" [title]="m.taskDescription">{{ m.taskDescription }}</td>
                <td><span class="badge badge-{{m.priority?.toLowerCase()}}">{{ m.priority }}</span></td>
                <td><span class="badge badge-{{m.status?.toLowerCase()}}">{{ formatStatus(m.status) }}</span></td>
                <td>{{ m.scheduledDate | date:'mediumDate' }}</td>
                <td>{{ m.assignedEngineer?.fullName || '—' }}</td>
                <td>{{ m.estimatedHours }}h</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <a [routerLink]="['/maintenance', m.id, 'edit']" class="btn btn-secondary btn-sm btn-icon" title="Edit">✏</a>
                    <button class="btn btn-success btn-sm" *ngIf="m.status === 'PLANNED' && canEngineer" (click)="updateStatus(m, 'IN_PROGRESS')">Start</button>
                    <button class="btn btn-primary btn-sm" *ngIf="m.status === 'IN_PROGRESS' && canEngineer" (click)="updateStatus(m, 'COMPLETED')">Complete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="schedules.length === 0">
          <div class="empty-icon">🔧</div>
          <p>No maintenance schedules found.</p>
        </div>
        <div class="pagination" *ngIf="totalPages > 0">
          <div class="pagination-info">{{ totalElements }} total tasks</div>
          <div class="pagination-controls">
            <button class="page-btn" [disabled]="currentPage===0" (click)="changePage(currentPage-1)">‹</button>
            <button class="page-btn" *ngFor="let p of getPages()" [class.active]="p===currentPage" (click)="changePage(p)">{{p+1}}</button>
            <button class="page-btn" [disabled]="currentPage===totalPages-1" (click)="changePage(currentPage+1)">›</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MaintenanceListComponent implements OnInit {
  schedules: any[] = [];
  loading = true;
  statusFilter = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  get canCreate() { return this.auth.hasRole(['ADMIN', 'MANAGER']); }
  get canEngineer() { return this.auth.hasRole(['ADMIN', 'MANAGER', 'ENGINEER']); }

  constructor(private api: ApiService, private auth: AuthService, private notif: NotificationService) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.loading = true;
    const params: any = { page: this.currentPage, size: 10, sortBy: 'scheduledDate', sortDir: 'desc' };
    if (this.statusFilter) params.status = this.statusFilter;
    this.api.getMaintenance(params).subscribe({
      next: (res) => { this.schedules = res.data.content; this.totalPages = res.data.totalPages; this.totalElements = res.data.totalElements; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  updateStatus(m: any, status: string): void {
    this.api.updateMaintenanceStatus(m.id, status).subscribe({
      next: () => { this.notif.addNotification('success', 'Status Updated', `Task #${m.id} set to ${status}`); this.loadData(); },
      error: (err) => { this.notif.addNotification('error', 'Update Failed', err.error?.message || 'Error updating status'); }
    });
  }

  formatStatus(s: string): string { return s?.replace('_', ' ') || ''; }
  changePage(p: number): void { this.currentPage = p; this.loadData(); }
  getPages(): number[] { const r: number[] = []; const s = Math.max(0, this.currentPage-2); for (let i = s; i < Math.min(this.totalPages, s+5); i++) r.push(i); return r; }
}
