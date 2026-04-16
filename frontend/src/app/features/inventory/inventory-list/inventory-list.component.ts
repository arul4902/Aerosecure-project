import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>📦 Spare Parts Inventory</h1>
          <p>Manage and monitor aircraft spare parts</p>
        </div>
        <a routerLink="/inventory/new" class="btn btn-primary" *ngIf="canEdit">＋ Add Part</a>
      </div>

      <div class="card" style="margin-bottom:16px;padding:14px 20px">
        <div class="filter-bar">
          <div class="search-input">
            <span class="search-icon">🔍</span>
            <input class="form-control" type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" placeholder="Search part name, ID, category...">
          </div>
          <select class="form-control filter-select" [(ngModel)]="statusFilter" (ngModelChange)="loadData()">
            <option value="">All Status</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
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
                <th>Part ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th *ngIf="canEdit">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of parts">
                <td><strong style="color:var(--accent)">{{ p.partId }}</strong></td>
                <td>{{ p.name }}</td>
                <td>{{ p.category }}</td>
                <td>{{ p.supplier }}</td>
                <td>
                  <strong>{{ p.quantity }}</strong>
                  <span style="color:var(--text-muted);font-size:11px;margin-left:4px">/ min {{ p.minStockLevel }}</span>
                </td>
                <td>\${{ p.unitPrice | number:'1.2-2' }}</td>
                <td><span class="badge badge-{{p.status?.toLowerCase()}}">{{ formatStatus(p.status) }}</span></td>
                <td *ngIf="canEdit">
                  <div style="display:flex;gap:6px">
                    <a [routerLink]="['/inventory', p.id, 'edit']" class="btn btn-secondary btn-sm btn-icon" title="Edit">✏</a>
                    <button class="btn btn-warning btn-sm btn-icon" *ngIf="p.quantity <= p.minStockLevel" (click)="simulateProcurement(p)" title="Simulate Procurement">🛒</button>
                    <button class="btn btn-danger btn-sm btn-icon" (click)="deletePart(p)" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="parts.length === 0">
          <div class="empty-icon">📦</div>
          <p>No spare parts found.</p>
        </div>
        <div class="pagination" *ngIf="totalPages > 0">
          <div class="pagination-info">Showing {{ parts.length }} of {{ totalElements }} parts</div>
          <div class="pagination-controls">
            <button class="page-btn" [disabled]="currentPage === 0" (click)="changePage(currentPage-1)">‹</button>
            <button class="page-btn" *ngFor="let p of getPages()" [class.active]="p === currentPage" (click)="changePage(p)">{{ p+1 }}</button>
            <button class="page-btn" [disabled]="currentPage === totalPages-1" (click)="changePage(currentPage+1)">›</button>
          </div>
        </div>
      </div>
      
      <!-- Delete modal -->
      <div class="modal-overlay" *ngIf="deletingPart" (click)="deletingPart=null">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>⚠ Confirm Delete</h2>
            <button class="btn btn-secondary btn-sm" (click)="deletingPart=null">✕</button>
          </div>
          <p style="color:var(--text-secondary)">Delete part <strong style="color:var(--accent)">{{ deletingPart.partId }}</strong> ({{ deletingPart.name }})?</p>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="deletingPart=null">Cancel</button>
            <button class="btn btn-danger" (click)="confirmDelete()">Delete Part</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventoryListComponent implements OnInit {
  parts: any[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  searchTimeout: any;
  deletingPart: any = null;

  get canEdit() { return this.auth.hasRole(['ADMIN', 'MANAGER']); }

  constructor(private api: ApiService, private auth: AuthService, private notif: NotificationService) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.loading = true;
    this.api.getParts({ search: this.searchTerm, status: this.statusFilter, page: this.currentPage, size: 10, sortBy: 'id', sortDir: 'asc' }).subscribe({
      next: (res) => { this.parts = res.data.content; this.totalPages = res.data.totalPages; this.totalElements = res.data.totalElements; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.currentPage = 0; this.loadData(); }, 400);
  }

  clearFilters(): void { this.searchTerm = ''; this.statusFilter = ''; this.currentPage = 0; this.loadData(); }
  formatStatus(s: string): string { return s?.replace(/_/g, ' ') || ''; }
  changePage(p: number): void { this.currentPage = p; this.loadData(); }
  getPages(): number[] { const r: number[] = []; const s = Math.max(0, this.currentPage-2); for (let i = s; i < Math.min(this.totalPages, s+5); i++) r.push(i); return r; }
  deletePart(p: any): void { this.deletingPart = p; }

  confirmDelete(): void {
    this.api.deletePart(this.deletingPart.id).subscribe({
      next: () => { this.notif.addNotification('success', 'Part Deleted', `${this.deletingPart.partId} removed.`); this.deletingPart = null; this.loadData(); },
      error: (err) => { this.notif.addNotification('error', 'Delete Failed', err.error?.message); this.deletingPart = null; }
    });
  }

  simulateProcurement(p: any): void {
    this.api.simulateProcurement(p.id, 10).subscribe({
      next: () => { this.notif.addNotification('success', 'Procurement Successful', `10 units ordered for ${p.partId}.`); this.loadData(); },
      error: (err) => { this.notif.addNotification('error', 'Procurement Failed', err.error?.message); }
    });
  }
}
