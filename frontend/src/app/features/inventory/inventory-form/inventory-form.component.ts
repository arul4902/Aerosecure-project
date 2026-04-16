import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? '✏ Edit Part' : '📦 Add Spare Part' }}</h1>
          <p>{{ isEdit ? 'Update inventory details' : 'Add a new part to inventory' }}</p>
        </div>
        <a routerLink="/inventory" class="btn btn-secondary">← Back</a>
      </div>
      <div class="card" style="max-width:800px">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Part ID *</label>
              <input class="form-control" formControlName="partId" [class.is-invalid]="isInvalid('partId')" placeholder="e.g. SP-123">
              <div class="form-error" *ngIf="isInvalid('partId')">Part ID is required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Name *</label>
              <input class="form-control" formControlName="name" [class.is-invalid]="isInvalid('name')" placeholder="e.g. Engine Oil Filter">
              <div class="form-error" *ngIf="isInvalid('name')">Name is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <input class="form-control" formControlName="category" placeholder="e.g. Engine">
            </div>
            <div class="form-group">
              <label class="form-label">Supplier</label>
              <input class="form-control" formControlName="supplier" placeholder="e.g. Pratt & Whitney">
            </div>
          </div>

          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Quantity *</label>
              <input class="form-control" type="number" formControlName="quantity" [class.is-invalid]="isInvalid('quantity')" min="0">
              <div class="form-error" *ngIf="isInvalid('quantity')">Quantity is required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Min Stock Level *</label>
              <input class="form-control" type="number" formControlName="minStockLevel" [class.is-invalid]="isInvalid('minStockLevel')" min="0">
              <div class="form-error" *ngIf="isInvalid('minStockLevel')">Required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Unit Price ($)</label>
              <input class="form-control" type="number" formControlName="unitPrice" min="0" step="0.01">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Compatible Aircraft</label>
            <input class="form-control" formControlName="compatibleAircraft" placeholder="e.g. Boeing 737, Airbus A320">
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">⚠ {{ errorMessage }}</div>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <a routerLink="/inventory" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Saving...' : (isEdit ? '✓ Update Part' : '✓ Add Part') }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InventoryFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit = false;
  partId?: number;
  errorMessage = '';

  constructor(private fb: FormBuilder, private api: ApiService, private notif: NotificationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.partId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.partId;
    this.form = this.fb.group({
      partId: ['', Validators.required],
      name: ['', Validators.required],
      category: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]],
      supplier: [''],
      unitPrice: [0],
      compatibleAircraft: ['']
    });
    if (this.isEdit) { this.loadPart(); }
  }

  loadPart(): void {
    this.api.getPartById(this.partId!).subscribe({
      next: (res) => { this.form.patchValue(res.data); },
      error: () => { this.errorMessage = 'Failed to load part data.'; }
    });
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c?.invalid && c.touched); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMessage = '';
    const req = this.isEdit ? this.api.updatePart(this.partId!, this.form.value) : this.api.createPart(this.form.value);
    req.subscribe({
      next: (res) => { this.notif.addNotification('success', 'Part Saved', `${res.data.name} saved successfully.`); this.router.navigate(['/inventory']); },
      error: (err) => { this.errorMessage = err.error?.message || 'Failed to save part.'; this.loading = false; }
    });
  }
}
