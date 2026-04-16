import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-compliance-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>🛡 Compliance Audits</h1>
          <p>Track audit records and airworthiness directives</p>
        </div>
        <a routerLink="/compliance/new" class="btn btn-primary" *ngIf="canEdit">＋ New Audit</a>
      </div>

      <div class="card" style="margin-bottom:16px;padding:14px 20px">
        <div class="filter-bar">
          <select class="form-control filter-select" [(ngModel)]="statusFilter" (ngModelChange)="loadData()">
            <option value="">All Status</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
            <option value="PENDING">Pending</option>
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
                <th>Aircraft</th>
                <th>Regulation</th>
                <th>Audit Date</th>
                <th>Status</th>
                <th>Auditor</th>
                <th>Findings</th>
                <th *ngIf="canEdit">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of records" [class.bg-danger-subtle]="c.complianceStatus === 'NON_COMPLIANT'">
                <td><strong style="color:var(--accent)">{{ c.aircraft?.aircraftId }}</strong></td>
                <td>{{ c.regulationType }}</td>
                <td>{{ c.auditDate | date:'mediumDate' }}</td>
                <td><span class="badge badge-{{c.complianceStatus?.toLowerCase()}}">{{ formatStatus(c.complianceStatus) }}</span></td>
                <td>{{ c.auditor?.fullName || '—' }}</td>
                <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" [title]="c.findings">{{ c.findings }}</td>
                <td *ngIf="canEdit">
                  <a [routerLink]="['/compliance', c.id, 'edit']" class="btn btn-secondary btn-sm btn-icon">✏</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="records.length === 0">
          <div class="empty-icon">🛡</div>
          <p>No compliance records found.</p>
        </div>
        <div class="pagination" *ngIf="totalPages > 0">
          <div class="pagination-info">Showing {{ records.length }} of {{ totalElements }} records</div>
          <div class="pagination-controls">
            <button class="page-btn" [disabled]="currentPage === 0" (click)="changePage(currentPage-1)">‹</button>
            <button class="page-btn" *ngFor="let p of getPages()" [class.active]="p === currentPage" (click)="changePage(p)">{{ p+1 }}</button>
            <button class="page-btn" [disabled]="currentPage === totalPages-1" (click)="changePage(currentPage+1)">›</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ComplianceListComponent implements OnInit {
  records: any[] = [];
  loading = true;
  statusFilter = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  get canEdit() { return this.auth.hasRole(['ADMIN', 'MANAGER']); }

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.loading = true;
    const params: any = { page: this.currentPage, size: 10, sortBy: 'auditDate', sortDir: 'desc' };
    if (this.statusFilter) params.status = this.statusFilter;
    this.api.getCompliance(params).subscribe({
      next: (res) => { this.records = res.data.content; this.totalPages = res.data.totalPages; this.totalElements = res.data.totalElements; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  formatStatus(s: string): string { return s?.replace(/_/g, ' ') || ''; }
  changePage(p: number): void { this.currentPage = p; this.loadData(); }
  getPages(): number[] { const r: number[] = []; const s = Math.max(0, this.currentPage-2); for (let i = s; i < Math.min(this.totalPages, s+5); i++) r.push(i); return r; }
}
