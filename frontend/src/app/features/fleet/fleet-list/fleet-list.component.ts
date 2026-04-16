import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-fleet-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>✈ Fleet Management</h1>
          <p>Manage and monitor your aircraft fleet</p>
        </div>
        <a routerLink="/fleet/new" class="btn btn-primary" *ngIf="canEdit">
          ＋ Add Aircraft
        </a>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:16px;padding:14px 20px">
        <div class="filter-bar">
          <div class="search-input">
            <span class="search-icon">🔍</span>
            <input class="form-control" type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" placeholder="Search aircraft ID, model, manufacturer...">
          </div>
          <select class="form-control filter-select" [(ngModel)]="statusFilter" (ngModelChange)="loadAircraft()">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="RETIRED">Retired</option>
          </select>
          <button class="btn btn-secondary btn-sm" (click)="clearFilters()">Clear</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div class="card" *ngIf="!loading">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Aircraft ID</th>
                <th>Model</th>
                <th>Manufacturer</th>
                <th>Airline</th>
                <th>Flight Hours</th>
                <th>Year</th>
                <th>Status</th>
                <th>Last Maintenance</th>
                <th *ngIf="canEdit">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of aircraft">
                <td><strong style="color:var(--accent)">{{ a.aircraftId }}</strong></td>
                <td>{{ a.model }}</td>
                <td>{{ a.manufacturer }}</td>
                <td>{{ a.airline }}</td>
                <td>{{ a.totalFlightHours | number:'1.0-0' }} hrs</td>
                <td>{{ a.yearManufactured }}</td>
                <td><span class="badge badge-{{a.status?.toLowerCase()}}">{{ a.status | titlecase }}</span></td>
                <td>{{ a.lastMaintenance ? (a.lastMaintenance | date:'mediumDate') : 'N/A' }}</td>
                <td *ngIf="canEdit">
                  <div style="display:flex;gap:6px">
                    <a [routerLink]="['/fleet', a.id, 'edit']" class="btn btn-secondary btn-sm btn-icon" title="Edit">✏</a>
                    <button class="btn btn-danger btn-sm btn-icon" (click)="deleteAircraft(a)" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="aircraft.length === 0">
          <div class="empty-icon">✈</div>
          <p>No aircraft found. Adjust filters or add a new aircraft.</p>
        </div>
        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 0">
          <div class="pagination-info">Showing {{ aircraft.length }} of {{ totalElements }} aircraft</div>
          <div class="pagination-controls">
            <button class="page-btn" [disabled]="currentPage === 0" (click)="changePage(currentPage-1)">‹</button>
            <button class="page-btn" *ngFor="let p of getPages()" [class.active]="p === currentPage" (click)="changePage(p)">{{ p+1 }}</button>
            <button class="page-btn" [disabled]="currentPage === totalPages-1" (click)="changePage(currentPage+1)">›</button>
          </div>
        </div>
      </div>

      <!-- Delete confirm modal -->
      <div class="modal-overlay" *ngIf="deletingAircraft" (click)="deletingAircraft=null">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>⚠ Confirm Delete</h2>
            <button class="btn btn-secondary btn-sm" (click)="deletingAircraft=null">✕</button>
          </div>
          <p style="color:var(--text-secondary)">
            Are you sure you want to delete aircraft <strong style="color:var(--accent)">{{ deletingAircraft.aircraftId }}</strong> ({{ deletingAircraft.model }})?
            This action cannot be undone.
          </p>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="deletingAircraft=null">Cancel</button>
            <button class="btn btn-danger" (click)="confirmDelete()">Delete Aircraft</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FleetListComponent implements OnInit {
  aircraft: any[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  deletingAircraft: any = null;
  searchTimeout: any;

  get canEdit(): boolean { return this.authService.hasRole(['ADMIN', 'MANAGER']); }

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void { this.loadAircraft(); }

  loadAircraft(): void {
    this.loading = true;
    this.apiService.getAircraft({ search: this.searchTerm, status: this.statusFilter, page: this.currentPage, size: 10, sortBy: 'id', sortDir: 'asc' }).subscribe({
      next: (res) => {
        this.aircraft = res.data.content;
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 0; this.loadAircraft(); }, 400);
  }

  clearFilters(): void { this.searchTerm = ''; this.statusFilter = ''; this.currentPage = 0; this.loadAircraft(); }

  changePage(page: number): void { this.currentPage = page; this.loadAircraft(); }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  }

  deleteAircraft(a: any): void { this.deletingAircraft = a; }

  confirmDelete(): void {
    this.apiService.deleteAircraft(this.deletingAircraft.id).subscribe({
      next: () => {
        this.notifService.addNotification('success', 'Aircraft Deleted', `${this.deletingAircraft.aircraftId} removed from fleet.`);
        this.deletingAircraft = null;
        this.loadAircraft();
      },
      error: (err) => {
        this.notifService.addNotification('error', 'Delete Failed', err.error?.message || 'Could not delete aircraft.');
        this.deletingAircraft = null;
      }
    });
  }
}
