import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content fade-in">
      <div class="page-header">
        <div>
          <h1>📊 Predictive Analytics & Reporting</h1>
          <p>Fleet reliability, MTBF tracking, and compliance metrics</p>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-secondary" (click)="exportCSV('monthly')">
            <span style="font-size:16px">📥</span> Download Monthly Report
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <div class="card" style="margin-bottom:24px">
          <div class="card-header">
            <h3>📈 Mean Time Between Failures (MTBF) by Aircraft</h3>
            <span class="badge badge-medium">Target: > 1500 hrs</span>
          </div>
          <div class="chart-container" style="height:350px">
            <canvas #mtbfChart></canvas>
          </div>
        </div>

        <div class="analytics-grid">
          <div class="card">
            <div class="card-header">
              <h3>⏱ Aircraft Downtime Analysis</h3>
            </div>
            <div class="chart-container">
              <canvas #downtimeChart></canvas>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>🛡 Fleet Compliance Scores</h3>
            </div>
            <div class="chart-container">
              <canvas #complianceChart></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 900px) { .analytics-grid { grid-template-columns: 1fr; } }
  `]
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  loading = true;
  mtbfData: any[] = [];
  downtimeData: any[] = [];
  complianceData: any[] = [];

  @ViewChild('mtbfChart') mtbfCanvas!: ElementRef;
  @ViewChild('downtimeChart') downtimeCanvas!: ElementRef;
  @ViewChild('complianceChart') complianceCanvas!: ElementRef;

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.loadData(); }
  ngAfterViewInit(): void {
    if (!this.loading) this.renderCharts();
  }

  loadData(): void {
    this.loading = true;
    let loaded = 0;
    const checkDone = () => { loaded++; if (loaded === 3) { this.loading = false; setTimeout(() => this.renderCharts(), 50); } };
    
    this.api.getMtbf().subscribe({ next: (res) => { this.mtbfData = res.data; checkDone(); }, error: () => { checkDone(); } });
    this.api.getDowntime().subscribe({ next: (res) => { this.downtimeData = res.data; checkDone(); }, error: () => { checkDone(); } });
    this.api.getComplianceScore().subscribe({ next: (res) => { this.complianceData = res.data; checkDone(); }, error: () => { checkDone(); } });
  }

  renderCharts(): void {
    // Shared chart options for dark theme
    Chart.defaults.color = 'rgba(255,255,255,0.6)';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';

    // 1. MTBF Chart (Bar)
    if (this.mtbfCanvas && this.mtbfData.length > 0) {
      new Chart(this.mtbfCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.mtbfData.map(d => d.aircraftId),
          datasets: [{
            label: 'MTBF (Hours)',
            data: this.mtbfData.map(d => d.mtbf),
            backgroundColor: 'rgba(0, 212, 255, 0.6)',
            borderColor: 'rgba(0, 212, 255, 1)',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display:false } } }
      });
    }

    // 2. Downtime Chart (Line)
    if (this.downtimeCanvas && this.downtimeData.length > 0) {
      new Chart(this.downtimeCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: this.downtimeData.map(d => d.aircraftId),
          datasets: [{
            label: 'Downtime (Hours)',
            data: this.downtimeData.map(d => d.downtime),
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    // 3. Compliance Chart (Doughnut)
    if (this.complianceCanvas && this.complianceData.length > 0) {
      // Aggregate into brackets for doughnut chart
      const scores = this.complianceData.map(d => d.complianceScore);
      const high = scores.filter(s => s >= 90).length;
      const med = scores.filter(s => s >= 70 && s < 90).length;
      const low = scores.filter(s => s < 70).length;

      new Chart(this.complianceCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['High (>90%)', 'Medium (70-90%)', 'Low (<70%)'],
          datasets: [{
            data: [high, med, low],
            backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderWidth: 0
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
      });
    }
  }

  exportCSV(type: string): void {
    this.api.exportCsv(type).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aerosecure_${type}_report.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    });
  }
}
