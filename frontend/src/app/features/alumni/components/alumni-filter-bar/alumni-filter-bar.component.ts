import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alumni-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumni-filter-bar.component.html',
  styleUrls: ['./alumni-filter-bar.component.scss']
})
export class AlumniFilterBarComponent implements OnInit {
  @Input() batches: string[] = [];
  @Input() programs: string[] = [];
  @Input() industries: string[] = [];
  
  @Output() filterChange = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  selectedBatch = '';
  selectedProgram = '';
  selectedIndustry = '';
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
    this.selectedBatch = '';
    this.selectedProgram = '';
    this.selectedIndustry = '';
    this.sortBy = 'newest';
    this.emitFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  private emitFilters() {
    this.filterChange.emit({
      batch: this.selectedBatch || undefined,
      program: this.selectedProgram || undefined,
      industry: this.selectedIndustry || undefined,
      sortBy: this.sortBy
    });
  }
}