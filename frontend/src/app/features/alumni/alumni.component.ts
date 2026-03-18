import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlumniService, Alumni, FilterParams } from './services/alumni.service';
import { AlumniCardComponent } from './components/alumni-card/alumni-card.component';
import { AlumniFilterBarComponent } from './components/alumni-filter-bar/alumni-filter-bar.component';
import { AlumniFormModalComponent } from './components/alumni-form-modal/alumni-form-modal.component';
import { AlumniDetailModalComponent } from './components/alumni-detail-modal/alumni-detail-modal.component';

@Component({
  selector: 'app-alumni',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    AlumniCardComponent, 
    AlumniFilterBarComponent,
    AlumniFormModalComponent,
    AlumniDetailModalComponent
  ],
  templateUrl: './alumni.component.html',
  styleUrls: ['./alumni.component.scss']
})
export class AlumniComponent implements OnInit {
  alumni: Alumni[] = [];
  featuredAlumni: Alumni[] = [];
  loading = false;
  hasMore = false;
  currentPage = 1;
  totalItems = 0;
  
  // Stats
  totalAlumni = 0;
  verifiedAlumni = 0;
  batchDistribution: any[] = [];
  
  // Modal properties
  showFormModal = false;
  showDetailModal = false;
  selectedAlumni: Alumni | null = null;
  isEditMode = false;
  
  // Filter state
  currentFilters: FilterParams = {
    page: 1,
    limit: 12
  };

  // Available filters for dropdowns
  batches = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());
  programs = ['Science', 'Commerce', 'Arts', 'BBA', 'BCA', 'B.Com', 'MBA', 'MCA', 'Other'];
  industries = ['Technology', 'Finance', 'Education', 'Healthcare', 'Manufacturing', 'Retail', 'Consulting', 'Government', 'Non-Profit', 'Other'];

  constructor(private alumniService: AlumniService) {}

  ngOnInit() {
    this.loadAlumni();
    this.loadStats();
    this.loadFeaturedAlumni();
  }

  loadAlumni() {
  this.loading = true;
  
  const filters = { ...this.currentFilters };

  this.alumniService.getVerifiedAlumni(filters).subscribe({
    next: (response: any) => {
      if (response && response.status === 'Y') {
        if (filters.page === 1) {
          this.alumni = response.data;
        } else {
          this.alumni = [...this.alumni, ...response.data];
        }
        this.hasMore = response.pagination?.hasMore || false;
        this.totalItems = response.pagination?.totalItems || 0;
        this.currentPage = response.pagination?.currentPage || 1;
      }
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading alumni:', error);
      this.loading = false;
    }
  });
}

  loadStats() {
    this.alumniService.getStats().subscribe({
      next: (response: any) => {
        if (response && response.status === 'Y') {
          this.totalAlumni = response.data.totalAlumni;
          this.verifiedAlumni = response.data.verifiedAlumni;
          this.batchDistribution = response.data.batchDistribution;
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  loadFeaturedAlumni() {
    this.alumniService.getFeaturedAlumni().subscribe({
      next: (response: any) => {
        if (response && response.status === 'Y') {
          this.featuredAlumni = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading featured alumni:', error);
      }
    });
  }

  onFilterChange(filters: any) {
    this.currentFilters = {
      ...this.currentFilters,
      ...filters,
      page: 1
    };
    this.alumni = [];
    this.loadAlumni();
  }

  onSearch(searchTerm: string) {
    this.currentFilters.search = searchTerm || undefined;
    this.currentFilters.page = 1;
    this.alumni = [];
    this.loadAlumni();
  }

  onLoadMore() {
    this.currentFilters.page = (this.currentFilters.page || 1) + 1;
    this.loadAlumni();
  }

  // Modal methods
  openAddModal() {
    this.isEditMode = false;
    this.selectedAlumni = null;
    this.showFormModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditModal(alumni: Alumni) {
    this.isEditMode = true;
    this.selectedAlumni = alumni;
    this.showFormModal = true;
    document.body.style.overflow = 'hidden';
  }

  openDetailModal(alumni: Alumni) {
    this.selectedAlumni = alumni;
    this.showDetailModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeFormModal() {
    this.showFormModal = false;
    document.body.style.overflow = 'auto';
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedAlumni = null;
    document.body.style.overflow = 'auto';
  }

  onAlumniCreated(alumni: Alumni) {
    this.loadAlumni();
    this.loadStats();
    this.loadFeaturedAlumni();
    this.closeFormModal();
  }

  onAlumniUpdated(alumni: Alumni) {
    this.loadAlumni();
    this.loadStats();
    this.loadFeaturedAlumni();
    this.closeFormModal();
  }

  onAlumniDeleted(alumniId: string) {
    this.alumni = this.alumni.filter(a => a._id !== alumniId);
    this.loadStats();
    this.loadFeaturedAlumni();
    this.closeDetailModal();
  }

  onAlumniClick(alumni: Alumni) {
    this.openDetailModal(alumni);
  }

  getBatchCount(batch: string): number {
    const distribution = this.batchDistribution.find(b => b._id === batch);
    return distribution ? distribution.count : 0;
  }
}