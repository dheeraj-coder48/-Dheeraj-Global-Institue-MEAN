import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  categories = [
    { value: '', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Books', label: 'Books' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'ID Cards', label: 'ID Cards' },
    { value: 'Stationery', label: 'Stationery' },
    { value: 'Other', label: 'Other' }
  ];

  locations = [
    { value: '', label: 'All Locations' },
    { value: 'Main Building', label: 'Main Building' },
    { value: 'Library', label: 'Library' },
    { value: 'Cafeteria', label: 'Cafeteria' },
    { value: 'Sports Complex', label: 'Sports Complex' },
    { value: 'Auditorium', label: 'Auditorium' },
    { value: 'Parking Area', label: 'Parking Area' },
    { value: 'Classroom', label: 'Classroom' },
    { value: 'Other', label: 'Other' }
  ];

  selectedCategory = '';
  selectedLocation = '';
  sortBy = 'newest';
  searchTerm = '';
  showFilters = false;

  ngOnInit() {
    this.emitFilters();
  }

  onSearchInput() {
    this.search.emit(this.searchTerm);
  }

  onFilterChange() {
    this.emitFilters();
  }

  clearFilters() {
    this.selectedCategory = '';
    this.selectedLocation = '';
    this.sortBy = 'newest';
    this.emitFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  private emitFilters() {
    this.filterChange.emit({
      category: this.selectedCategory || undefined,
      location: this.selectedLocation || undefined,
      sortBy: this.sortBy
    });
  }
}