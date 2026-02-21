// notices.component.ts
import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notices',
  imports: [CommonModule],
  templateUrl: './notices.html',
  styleUrl: './notices.scss'
})
export class Notices {
  notices: any = [];
  selectedNotice: any = {
    category: "",
    date: "",
    description: "",
    title: "",
  };
  isModalOpen: boolean = false;  // Add this property

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.getNotices();
  }

  getNotices() {
    this.apiService.getNotices().subscribe({
      next: (response: any) => {
        if (response && response['status'] === 'Y') {
          this.notices = response.data;
          console.log(this.notices);
        }
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  showNotice(notice: any) {
    this.selectedNotice = notice;
    this.isModalOpen = true;  // Open modal
    document.body.style.overflow = 'hidden';  // Prevent background scrolling
  }

  closeModal() {  // Add this method
    this.isModalOpen = false;
    document.body.style.overflow = 'auto';  // Restore background scrolling
  }
}