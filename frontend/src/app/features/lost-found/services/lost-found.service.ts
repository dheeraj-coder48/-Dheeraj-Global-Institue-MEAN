import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LostFoundItem {
  _id?: string;
  type: 'lost' | 'found';
  itemName: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  rollNumber?: string;
  imagesUrl: string;
  images?: string[];
  status: 'active' | 'resolved' | 'deleted';
  resolvedBy?: {
    name: string;
    phone: string;
    email?: string;
    rollNumber?: string;
  };
  resolvedDate?: Date;
  resolvedMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedResponse {
  status: string;
  message: string;
  data: LostFoundItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

export interface FilterParams {
  type?: 'lost' | 'found';
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LostFoundService {
  private apiUrl = `${environment.apiUrl}/lost-found`;

  constructor(private http: HttpClient) {}

  // Get all posts with filters
  getPosts(filters: FilterParams = {}): Observable<PaginatedResponse> {
    const params: any = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  // Get single post by ID
  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create new post
  createPost(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // Update post (admin only)
  updatePost(id: string, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // Delete post (admin only)
  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Mark item as resolved (public)
  markAsResolved(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/resolve`, data);
  }

  // Get stats
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}