import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'fleet',
        loadComponent: () => import('./features/fleet/fleet-list/fleet-list.component').then(m => m.FleetListComponent)
      },
      {
        path: 'fleet/new',
        loadComponent: () => import('./features/fleet/fleet-form/fleet-form.component').then(m => m.FleetFormComponent),
        canActivate: [roleGuard(['ADMIN', 'MANAGER'])]
      },
      {
        path: 'fleet/:id/edit',
        loadComponent: () => import('./features/fleet/fleet-form/fleet-form.component').then(m => m.FleetFormComponent),
        canActivate: [roleGuard(['ADMIN', 'MANAGER'])]
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./features/maintenance/maintenance-list/maintenance-list.component').then(m => m.MaintenanceListComponent)
      },
      {
        path: 'maintenance/new',
        loadComponent: () => import('./features/maintenance/maintenance-form/maintenance-form.component').then(m => m.MaintenanceFormComponent),
        canActivate: [roleGuard(['ADMIN', 'MANAGER'])]
      },
      {
        path: 'maintenance/:id/edit',
        loadComponent: () => import('./features/maintenance/maintenance-form/maintenance-form.component').then(m => m.MaintenanceFormComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory-list/inventory-list.component').then(m => m.InventoryListComponent)
      },
      {
        path: 'inventory/new',
        loadComponent: () => import('./features/inventory/inventory-form/inventory-form.component').then(m => m.InventoryFormComponent),
        canActivate: [roleGuard(['ADMIN', 'MANAGER'])]
      },
      {
        path: 'inventory/:id/edit',
        loadComponent: () => import('./features/inventory/inventory-form/inventory-form.component').then(m => m.InventoryFormComponent),
        canActivate: [roleGuard(['ADMIN', 'MANAGER'])]
      },
      {
        path: 'compliance',
        loadComponent: () => import('./features/compliance/compliance-list/compliance-list.component').then(m => m.ComplianceListComponent)
      },
      {
        path: 'compliance/new',
        loadComponent: () => import('./features/compliance/compliance-form/compliance-form.component').then(m => m.ComplianceFormComponent),
        canActivate: [roleGuard(['ADMIN', 'MANAGER'])]
      },
      {
        path: 'compliance/:id/edit',
        loadComponent: () => import('./features/compliance/compliance-form/compliance-form.component').then(m => m.ComplianceFormComponent),
        canActivate: [roleGuard(['ADMIN', 'MANAGER'])]
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
