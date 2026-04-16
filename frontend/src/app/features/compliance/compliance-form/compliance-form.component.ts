import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-compliance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? '✏ Edit Audit' : '🛡 New Compliance Audit' }}</h1>
          <p>{{ isEdit ? 'Update compliance record' : 'Record a new safety audit or AD compliance' }}</p>
        </div>
        <a routerLink="/compliance" class="btn btn-secondary">← Back</a>
      </div>
      <div class="card" style="max-width:800px">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Aircraft *</label>
              <select class="form-control" formControlName="aircraftId" [class.is-invalid]="isInvalid('aircraftId')">
                <option value="">Select Aircraft</option>
                <option *ngFor="let a of aircraft" [value]="a.id">{{ a.aircraftId }} - {{ a.model }}</option>
              </select>
              <div class="form-error" *ngIf="isInvalid('aircraftId')">Aircraft is required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Regulation / Authority *</label>
              <input class="form-control" formControlName="regulationType" [class.is-invalid]="isInvalid('regulationType')" placeholder="e.g. FAA AD 2024-12">
              <div class="form-error" *ngIf="isInvalid('regulationType')">Regulation is required</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Audit Date *</label>
              <input class="form-control" type="date" formControlName="auditDate" [class.is-invalid]="isInvalid('auditDate')">
              <div class="form-error" *ngIf="isInvalid('auditDate')">Date is required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-control" formControlName="complianceStatus">
                <option value="COMPLIANT">Compliant</option>
                <option value="NON_COMPLIANT">Non-Compliant</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Findings *</label>
            <textarea class="form-control" formControlName="findings" [class.is-invalid]="isInvalid('findings')" rows="3" placeholder="Detail any findings..."></textarea>
            <div class="form-error" *ngIf="isInvalid('findings')">Findings are required</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Next Audit Date</label>
              <input class="form-control" type="date" formControlName="nextAuditDate">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Remarks</label>
            <textarea class="form-control" formControlName="remarks" rows="2"></textarea>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">⚠ {{ errorMessage }}</div>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <a routerLink="/compliance" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Saving...' : (isEdit ? '✓ Update Audit' : '✓ Save Audit') }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ComplianceFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit = false;
  recordId?: number;
  aircraft: any[] = [];
  errorMessage = '';

  constructor(private fb: FormBuilder, private api: ApiService, private notif: NotificationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.recordId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.recordId;
    this.form = this.fb.group({
      aircraftId: [null, Validators.required],
      regulationType: ['', Validators.required],
      complianceStatus: ['COMPLIANT'],
      auditDate: ['', Validators.required],
      nextAuditDate: [''],
      findings: ['', Validators.required],
      remarks: ['']
    });
    this.api.getAllAircraft().subscribe(r => this.aircraft = r.data);
    if (this.isEdit) { this.loadRecord(); }
  }

  loadRecord(): void {
    this.api.getComplianceById(this.recordId!).subscribe({
      next: (res) => {
        const d = res.data;
        this.form.patchValue({
          aircraftId: d.aircraft?.id,
          regulationType: d.regulationType,
          complianceStatus: d.complianceStatus,
          auditDate: d.auditDate,
          nextAuditDate: d.nextAuditDate || '',
          findings: d.findings,
          remarks: d.remarks
        });
      }
    });
  }

  isInvalid(f: string): boolean { const c = this.form.get(f); return !!(c?.invalid && c.touched); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMessage = '';
    const val = { ...this.form.value };
    if (!val.nextAuditDate) delete val.nextAuditDate;
    const req = this.isEdit ? this.api.updateCompliance(this.recordId!, val) : this.api.createCompliance(val);
    req.subscribe({
      next: () => { this.notif.addNotification('success', 'Audit Saved', `Record ${this.isEdit ? 'updated' : 'created'} successfully.`); this.router.navigate(['/compliance']); },
      error: (err) => { this.errorMessage = err.error?.message || 'Failed to save record.'; this.loading = false; }
    });
  }
}
