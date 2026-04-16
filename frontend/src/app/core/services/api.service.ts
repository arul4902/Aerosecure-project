import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PageResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Aircraft
  getAircraft(params?: any): Observable<ApiResponse<PageResponse<any>>> {
    return this.http.get<ApiResponse<PageResponse<any>>>(`${this.apiUrl}/aircraft`, { params: this.buildParams(params) });
  }
  getAllAircraft(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/aircraft/all`);
  }
  getAircraftById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/aircraft/${id}`);
  }
  createAircraft(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/aircraft`, data);
  }
  updateAircraft(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/aircraft/${id}`, data);
  }
  deleteAircraft(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/aircraft/${id}`);
  }

  // Maintenance
  getMaintenance(params?: any): Observable<ApiResponse<PageResponse<any>>> {
    return this.http.get<ApiResponse<PageResponse<any>>>(`${this.apiUrl}/maintenance`, { params: this.buildParams(params) });
  }
  getMaintenanceById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/maintenance/${id}`);
  }
  getMaintenanceByEngineer(engineerId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/maintenance/engineer/${engineerId}`);
  }
  createMaintenance(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/maintenance`, data);
  }
  updateMaintenance(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/maintenance/${id}`, data);
  }
  assignEngineer(id: number, engineerId: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/maintenance/${id}/assign`, { engineerId });
  }
  updateMaintenanceStatus(id: number, status: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/maintenance/${id}/status`, { status });
  }

  // Spare Parts
  getParts(params?: any): Observable<ApiResponse<PageResponse<any>>> {
    return this.http.get<ApiResponse<PageResponse<any>>>(`${this.apiUrl}/parts`, { params: this.buildParams(params) });
  }
  getPartById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/parts/${id}`);
  }
  getLowStockParts(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/parts/low-stock`);
  }
  createPart(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/parts`, data);
  }
  updatePart(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/parts/${id}`, data);
  }
  deletePart(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/parts/${id}`);
  }
  simulateProcurement(id: number, quantity: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/parts/${id}/procure`, { quantity });
  }

  // Compliance
  getCompliance(params?: any): Observable<ApiResponse<PageResponse<any>>> {
    return this.http.get<ApiResponse<PageResponse<any>>>(`${this.apiUrl}/compliance`, { params: this.buildParams(params) });
  }
  getComplianceById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/compliance/${id}`);
  }
  getNonCompliant(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/compliance/non-compliant`);
  }
  createCompliance(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/compliance`, data);
  }
  updateCompliance(id: number, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/compliance/${id}`, data);
  }

  // Analytics
  getDashboard(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/analytics/dashboard`);
  }
  getMtbf(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/analytics/mtbf`);
  }
  getDowntime(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/analytics/downtime`);
  }
  getComplianceScore(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/analytics/compliance-score`);
  }
  exportCsv(type: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/analytics/export/${type}`, { responseType: 'blob' });
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return httpParams;
  }
}
