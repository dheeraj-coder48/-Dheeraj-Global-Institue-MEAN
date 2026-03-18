import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LostFoundService, LostFoundItem, FilterParams } from './services/lost-found.service';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { ItemFormModalComponent } from './components/item-form-modal/item-form-modal.component';
import { ItemDetailModalComponent } from './components/item-detail-modal/item-detail-modal.component';

@Component({
  selector: 'app-lost-found',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    ItemCardComponent, 
    FilterBarComponent, 
    ItemFormModalComponent,
    ItemDetailModalComponent
  ],
  templateUrl: './lost-found.component.html',
  styleUrls: ['./lost-found.component.scss']
})
export class LostFoundComponent implements OnInit {
  items: LostFoundItem[] = [];
  filteredItems: LostFoundItem[] = [];
  activeTab: 'lost' | 'found' | 'all' = 'all';
  loading = false;
  hasMore = false;
  currentPage = 1;
  totalItems = 0;
  
  // Modal properties
  selectedType: 'lost' | 'found' = 'lost';
  showModal = false;
  showDetailModal = false;
  selectedItem: LostFoundItem | null = null;
  
  // Filter state
  currentFilters: FilterParams = {
    page: 1,
    limit: 12
  };

  constructor(private lostFoundService: LostFoundService) {
    console.log('LostFoundComponent initialized');
  }

  ngOnInit() {
    console.log('Loading items...');
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    
    const filters = { ...this.currentFilters };
    if (this.activeTab !== 'all') {
      filters.type = this.activeTab;
    }

    console.log('Fetching with filters:', filters);

    this.lostFoundService.getPosts(filters).subscribe({
      next: (response: any) => {
        console.log('Response received:', response);
        if (response && response.status === 'Y') {
          if (filters.page === 1) {
            this.items = response.data;
          } else {
            this.items = [...this.items, ...response.data];
          }
          this.filteredItems = this.items;
          this.hasMore = response.pagination?.hasMore || false;
          this.totalItems = response.pagination?.totalItems || 0;
          this.currentPage = response.pagination?.currentPage || 1;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading = false;
      }
    });
  }

  onTabChange(tab: 'lost' | 'found' | 'all') {
    console.log('Tab changed to:', tab);
    this.activeTab = tab;
    this.currentFilters.page = 1;
    this.items = [];
    this.loadItems();
  }

  onFilterChange(filters: any) {
    console.log('Filters changed:', filters);
    this.currentFilters = {
      ...this.currentFilters,
      ...filters,
      page: 1
    };
    this.items = [];
    this.loadItems();
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
    this.currentFilters.search = searchTerm || undefined;
    this.currentFilters.page = 1;
    this.items = [];
    this.loadItems();
  }

  onLoadMore() {
    console.log('Loading more...');
    this.currentFilters.page = (this.currentFilters.page || 1) + 1;
    this.loadItems();
  }

  onItemResolved(itemId: string) {
    console.log('Item resolved:', itemId);
    this.loadItems(); // Refresh list
    this.closeDetailModal();
  }

  onItemDeleted(itemId: string) {
    console.log('Item deleted:', itemId);
    this.items = this.items.filter(item => item._id !== itemId);
    this.filteredItems = this.filteredItems.filter(item => item._id !== itemId);
    this.closeDetailModal();
  }

  // Modal methods
  openPostModal(type: 'lost' | 'found') {
    console.log('Opening post modal with type:', type);
    this.selectedType = type;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    console.log('Closing post modal');
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  openDetailModal(item: LostFoundItem) {
    console.log('Opening detail modal for item:', item);
    this.selectedItem = item;
    this.showDetailModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDetailModal() {
    console.log('Closing detail modal');
    this.showDetailModal = false;
    this.selectedItem = null;
    document.body.style.overflow = 'auto';
  }

  onItemPosted(item: any) {
    console.log('Item posted:', item);
    this.loadItems(); // Refresh the list
    this.closeModal();
  }
}