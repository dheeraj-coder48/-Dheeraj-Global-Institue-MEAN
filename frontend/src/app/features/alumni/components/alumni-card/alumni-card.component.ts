import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Alumni } from '../../services/alumni.service';

@Component({
  selector: 'app-alumni-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './alumni-card.component.html',
  styleUrls: ['./alumni-card.component.scss']
})
export class AlumniCardComponent {
  @Input() alumni!: Alumni;
  @Output() onClick = new EventEmitter<Alumni>();
  @Output() onEdit = new EventEmitter<Alumni>();
  @Output() onDelete = new EventEmitter<string>();

  getProgramClass(program: string): string {
    const programMap: {[key: string]: string} = {
      'Science': 'program-science',
      'Commerce': 'program-commerce',
      'Arts': 'program-arts',
      'BBA': 'program-bba',
      'BCA': 'program-bca',
      'B.Com': 'program-bcom',
      'MBA': 'program-mba',
      'MCA': 'program-mca',
      'Other': 'program-other'
    };
    return programMap[program] || 'program-other';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  onCardClick() {
    this.onClick.emit(this.alumni);
  }

  onEditClick(event: Event) {
    event.stopPropagation();
    this.onEdit.emit(this.alumni);
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${this.alumni.name}'s profile?`)) {
      this.onDelete.emit(this.alumni._id);
    }
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/default-profile.jpg';
  }
}