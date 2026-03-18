import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alumni } from '../../services/alumni.service';

@Component({
  selector: 'app-alumni-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alumni-detail-modal.component.html',
  styleUrls: ['./alumni-detail-modal.component.scss']
})
export class AlumniDetailModalComponent implements OnInit, OnDestroy {
  @Input() alumni: Alumni | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<Alumni>();
  @Output() onDelete = new EventEmitter<string>();

  activeTab: 'profile' | 'achievements' | 'contact' = 'profile';

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  closeModal() {
    this.onClose.emit();
  }

  editAlumni() {
    if (this.alumni) {
      this.onEdit.emit(this.alumni);
    }
  }

  deleteAlumni() {
    if (this.alumni && confirm(`Are you sure you want to delete ${this.alumni.name}'s profile?`)) {
      this.onDelete.emit(this.alumni._id);
    }
  }

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

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/default-profile.jpg';
  }

  shareOnLinkedIn() {
    if (this.alumni?.linkedin) {
      window.open(this.alumni.linkedin, '_blank');
    }
  }

  shareOnFacebook() {
    if (this.alumni?.facebook) {
      window.open(this.alumni.facebook, '_blank');
    }
  }

  shareOnInstagram() {
    if (this.alumni?.instagram) {
      window.open(this.alumni.instagram, '_blank');
    }
  }

  sendEmail() {
    if (this.alumni?.email) {
      window.location.href = `mailto:${this.alumni.email}`;
    }
  }

  callPhone() {
    if (this.alumni?.phone) {
      window.location.href = `tel:${this.alumni.phone}`;
    }
  }
}