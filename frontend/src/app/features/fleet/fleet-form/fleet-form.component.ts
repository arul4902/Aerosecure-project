import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-fleet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? '✏ Edit Aircraft' : '✈ Add New Aircraft' }}</h1>
          <p>{{ isEdit ? 'Update aircraft information' : 'Register a new aircraft to the fleet' }}</p>
        </div>
        <a routerLink="/fleet" class="btn btn-secondary">← Back to Fleet</a>
      </div>

      <div class="card" style="max-width:800px">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Aircraft ID *</label>
              <input class="form-control" formControlName="aircraftId" [class.is-invalid]="isInvalid('aircraftId')" placeholder="e.g. AC-013">
              <div class="form-error" *ngIf="isInvalid('aircraftId')">Aircraft ID is required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Model *</label>
              <input class="form-control" formControlName="model" [class.is-invalid]="isInvalid('model')" placeholder="e.g. Boeing 737-800">
              <div class="form-error" *ngIf="isInvalid('model')">Model is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Manufacturer *</label>
              <input class="form-control" formControlName="manufacturer" [class.is-invalid]="isInvalid('manufacturer')" placeholder="e.g. Boeing">
              <div class="form-error" *ngIf="isInvalid('manufacturer')">Manufacturer is required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Serial Number</label>
              <input class="form-control" formControlName="serialNumber" placeholder="e.g. SN-12345">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Year Manufactured</label>
              <input class="form-control" type="number" formControlName="yearManufactured" placeholder="e.g. 2020" min="1950" max="2030">
            </div>
            <div class="form-group">
              <label class="form-label">Total Flight Hours</label>
              <input class="form-control" type="number" formControlName="totalFlightHours" placeholder="e.g. 5000" min="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Airline / Operator</label>
              <input class="form-control" formControlName="airline" placeholder="e.g. AeroSecure Airlines">
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-control" formControlName="status">
                <option value="ACTIVE">Active</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">⚠ {{ errorMessage }}</div>

          <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
            <a routerLink="/fleet" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Saving...' : (isEdit ? '✓ Update Aircraft' : '✓ Add Aircraft') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FleetFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';
  isEdit = false;
  aircraftId?: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notifService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.aircraftId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.aircraftId;
    this.form = this.fb.group({
      aircraftId: ['', Validators.required],
      model: ['', Validators.required],
      manufacturer: ['', Validators.required],
      serialNumber: [''],
      yearManufactured: [null],
      totalFlightHours: [0],
      airline: [''],
      status: ['ACTIVE']
    });
    if (this.isEdit) { this.loadAircraft(); }
  }

  loadAircraft(): void {
    this.apiService.getAircraftById(this.aircraftId!).subscribe({
      next: (res) => { this.form.patchValue(res.data); },
      error: () => { this.errorMessage = 'Failed to load aircraft data.'; }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMessage = '';
    const req = this.isEdit
      ? this.apiService.updateAircraft(this.aircraftId!, this.form.value)
      : this.apiService.createAircraft(this.form.value);
    req.subscribe({
      next: (res) => {
        this.notifService.addNotification('success', this.isEdit ? 'Aircraft Updated' : 'Aircraft Added', `${res.data.aircraftId} has been ${this.isEdit ? 'updated' : 'added'} successfully.`);
        this.router.navigate(['/fleet']);
      },
      error: (err) => { this.errorMessage = err.error?.message || 'Failed to save aircraft.'; this.loading = false; }
    });
  }
}
