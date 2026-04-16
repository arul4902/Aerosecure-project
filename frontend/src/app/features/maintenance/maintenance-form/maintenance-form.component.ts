import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>{{ isEdit ? '✏ Edit Schedule' : '🔧 New Maintenance Schedule' }}</h1>
          <p>{{ isEdit ? 'Update maintenance task details' : 'Create a new maintenance schedule' }}</p>
        </div>
        <a routerLink="/maintenance" class="btn btn-secondary">← Back</a>
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
              <label class="form-label">Assigned Engineer</label>
              <select class="form-control" formControlName="assignedEngineerId">
                <option value="">Unassigned</option>
                <option *ngFor="let e of engineers" [value]="e.id">{{ e.fullName }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Task Description *</label>
            <textarea class="form-control" formControlName="taskDescription" [class.is-invalid]="isInvalid('taskDescription')" rows="3" placeholder="Describe the maintenance task in detail..."></textarea>
            <div class="form-error" *ngIf="isInvalid('taskDescription')">Description is required</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Priority</label>
              <select class="form-control" formControlName="priority">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-control" formControlName="status">
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Scheduled Date *</label>
              <input class="form-control" type="date" formControlName="scheduledDate" [class.is-invalid]="isInvalid('scheduledDate')">
              <div class="form-error" *ngIf="isInvalid('scheduledDate')">Date is required</div>
            </div>
            <div class="form-group">
              <label class="form-label">Completion Date</label>
              <input class="form-control" type="date" formControlName="completionDate">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Estimated Hours</label>
              <input class="form-control" type="number" formControlName="estimatedHours" placeholder="e.g. 8" min="1">
            </div>
            <div class="form-group">
              <label class="form-label">Actual Hours</label>
              <input class="form-control" type="number" formControlName="actualHours" placeholder="e.g. 9" min="0">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Remarks</label>
            <textarea class="form-control" formControlName="remarks" rows="2" placeholder="Any additional remarks..."></textarea>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">⚠ {{ errorMessage }}</div>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <a routerLink="/maintenance" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Saving...' : (isEdit ? '✓ Update' : '✓ Create Schedule') }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MaintenanceFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit = false;
  scheduleId?: number;
  aircraft: any[] = [];
  engineers: any[] = [];
  errorMessage = '';

  constructor(private fb: FormBuilder, private api: ApiService, private auth: AuthService,
              private notif: NotificationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.scheduleId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.scheduleId;
    this.form = this.fb.group({
      aircraftId: [null, Validators.required],
      assignedEngineerId: [null],
      taskDescription: ['', Validators.required],
      priority: ['MEDIUM'],
      status: ['PLANNED'],
      scheduledDate: ['', Validators.required],
      completionDate: [''],
      estimatedHours: [null],
      actualHours: [null],
      remarks: ['']
    });
    this.api.getAllAircraft().subscribe(r => this.aircraft = r.data);
    this.auth.getEngineers().subscribe(r => this.engineers = r.data);
    if (this.isEdit) { this.loadSchedule(); }
  }

  loadSchedule(): void {
    this.api.getMaintenanceById(this.scheduleId!).subscribe({
      next: (res) => {
        const d = res.data;
        this.form.patchValue({
          aircraftId: d.aircraft?.id,
          assignedEngineerId: d.assignedEngineer?.id || null,
          taskDescription: d.taskDescription,
          priority: d.priority,
          status: d.status,
          scheduledDate: d.scheduledDate,
          completionDate: d.completionDate || '',
          estimatedHours: d.estimatedHours,
          actualHours: d.actualHours,
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
    if (!val.assignedEngineerId) val.assignedEngineerId = null;
    if (!val.completionDate) delete val.completionDate;
    const req = this.isEdit ? this.api.updateMaintenance(this.scheduleId!, val) : this.api.createMaintenance(val);
    req.subscribe({
      next: () => { this.notif.addNotification('success', 'Schedule Saved', `Maintenance task ${this.isEdit ? 'updated' : 'created'} successfully.`); this.router.navigate(['/maintenance']); },
      error: (err) => { this.errorMessage = err.error?.message || 'Failed to save schedule.'; this.loading = false; }
    });
  }
}
