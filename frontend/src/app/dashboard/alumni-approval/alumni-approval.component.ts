import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlumniService } from '../../features/alumni/services/alumni.service';

@Component({
  selector: 'app-alumni-approval',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './alumni-approval.component.html',
  styleUrls: ['./alumni-approval.component.scss']
})
export class AlumniApprovalComponent implements OnInit {
  pendingAlumni: any[] = [];
  loading = false;
  selectedAlumni: any = null;
  showDetailModal = false;

  constructor(private alumniService: AlumniService) {}

  ngOnInit() {
    this.loadPendingAlumni();
  }

  loadPendingAlumni() {
    this.loading = true;
    this.alumniService.getPendingAlumni().subscribe({
      next: (response: any) => {
        if (response && response.status === 'Y') {
          this.pendingAlumni = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending alumni:', error);
        this.loading = false;
      }
    });
  }

  viewDetails(alumni: any) {
    this.selectedAlumni = alumni;
    this.showDetailModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedAlumni = null;
    document.body.style.overflow = 'auto';
  }

  verifyAlumni(id: string) {
    if (confirm('Are you sure you want to verify this alumni?')) {
      this.alumniService.verifyAlumni(id).subscribe({
        next: (response: any) => {
          if (response.status === 'Y') {
            alert('Alumni verified successfully!');
            this.loadPendingAlumni();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error verifying alumni:', error);
          alert('Failed to verify alumni. Please try again.');
        }
      });
    }
  }

  rejectAlumni(id: string) {
    if (confirm('Are you sure you want to reject and delete this alumni?')) {
      this.alumniService.rejectAlumni(id).subscribe({
        next: (response: any) => {
          if (response.status === 'Y') {
            alert('Alumni rejected and deleted.');
            this.loadPendingAlumni();
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error rejecting alumni:', error);
          alert('Failed to reject alumni. Please try again.');
        }
      });
    }
  }
  onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/images/default-profile.jpg';
}
}