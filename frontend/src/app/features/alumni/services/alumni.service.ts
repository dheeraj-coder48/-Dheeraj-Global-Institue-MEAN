import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Alumni {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  program: string;
  rollNumber: string;
  currentEmployer?: string;
  designation?: string;
  industry?: string;
  location?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  profilePicture?: string;
  bio?: string;
  achievements?: string;
  isActive?: boolean;
  isVerified?: boolean;
  status?: 'pending' | 'verified' | 'rejected';  // ADD THIS LINE
  verifiedBy?: string;
  verifiedAt?: Date;
  views?: number;
  connections?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FilterParams {
  batch?: string;
  program?: string;
  industry?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse {
  status: string;
  message: string;
  data: Alumni[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AlumniService {
  private apiUrl = `${environment.apiUrl}/alumni`;

  constructor(private http: HttpClient) {}

  // Get all alumni with filters
  getAlumni(filters: FilterParams = {}): Observable<PaginatedResponse> {
    const params: any = {};
    if (filters.batch) params.batch = filters.batch;
    if (filters.program) params.program = filters.program;
    if (filters.industry) params.industry = filters.industry;
    if (filters.search) params.search = filters.search;
    if (filters.isActive !== undefined) params.isActive = filters.isActive;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  // Get single alumni by ID
  getAlumniById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create new alumni
  createAlumni(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Update alumni (admin only)
  updateAlumni(id: string, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // Delete alumni (admin only)
  deleteAlumni(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get alumni stats
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // Get featured alumni
  getFeaturedAlumni(): Observable<any> {
    return this.http.get(`${this.apiUrl}/featured`);
  }
  // Get pending alumni (admin only)
getPendingAlumni(): Observable<any> {
  return this.http.get(`${this.apiUrl}/pending`);
}

// Verify alumni (admin only)
verifyAlumni(id: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/verify/${id}`, {});
}

// Reject alumni (admin only)
rejectAlumni(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/reject/${id}`);
}

// Override getAlumni to only get verified
getVerifiedAlumni(filters: FilterParams = {}): Observable<PaginatedResponse> {
  const params: any = {};
  if (filters.batch) params.batch = filters.batch;
  if (filters.program) params.program = filters.program;
  if (filters.industry) params.industry = filters.industry;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  return this.http.get<PaginatedResponse>(`${this.apiUrl}/verified`, { params });
}
}