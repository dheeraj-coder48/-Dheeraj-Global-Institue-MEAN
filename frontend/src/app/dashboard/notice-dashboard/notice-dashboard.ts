import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Api } from '../../services/api';

@Component({
  selector: 'app-notice-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './notice-dashboard.html',
  styleUrls: ['./notice-dashboard.scss']
})
export class NoticeDashboard {

  notices: any[] = [];
  selectedNotice!: FormGroup;
  showModal: boolean = false;
  isEdit: boolean = false;
  id: string = '';

  constructor(private fb: FormBuilder, private apiService: Api) {
    this.selectedNotice = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      date: [this.getTodayDate(), Validators.required]
    });
  }

  ngOnInit() {
    this.loadNotices();
  }

  // =====================
  // LOAD NOTICES
  // =====================
  loadNotices() {
    this.apiService.getNotices().subscribe({
      next: (res: any) => {
        if (res && res.status === 'Y') {
          this.notices = res.data;
        }
      },
      error: err => console.error(err)
    });
  }

  // =====================
  // MODAL
  // =====================
  openAddModal() {
    this.isEdit = false;
    this.selectedNotice.reset({
      date: this.getTodayDate()
    });
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditModal(notice: any) {
    this.isEdit = true;
    this.id = notice._id;

    this.selectedNotice.patchValue({
      title: notice.title,
      category: notice.category,
      description: notice.description,
      date: this.formatDateForInput(notice.date)
    });

    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.selectedNotice.reset();
    document.body.style.overflow = 'auto';
  }

  // =====================
  // FORM SUBMIT
  // =====================
  onSubmit() {
    if (this.selectedNotice.invalid) return;

    const payload = this.selectedNotice.value;

    if (this.isEdit) {
      this.apiService.updateNotice(this.id, payload).subscribe({
        next: (res: any) => {
          if (res.status === 'Y') {
            alert(res.message);
            this.loadNotices();
            this.closeModal();
          }
        },
        error: err => console.error(err)
      });
    } else {
      this.apiService.addNotice(payload).subscribe({
        next: (res: any) => {
          if (res.status === 'Y') {
            alert(res.message);
            this.loadNotices();
            this.closeModal();
          }
        },
        error: err => console.error(err)
      });
    }
  }

  // =====================
  // DELETE
  // =====================
  deleteNotice(notice: any) {
    if (confirm(`Are you sure you want to delete "${notice.title}"?`)) {
      this.apiService.deleteNotice(notice._id).subscribe({
        next: (res: any) => {
          if (res.status === 'Y') {
            alert(res.message);
            this.loadNotices();
          }
        },
        error: err => console.error(err)
      });
    }
  }

  // =====================
  // HELPERS
  // =====================
  formatDateForInput(date: string) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  getTodayDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Optional helper methods for CSS classes
  getCategoryClass(category: string): string {
    const categoryMap: {[key: string]: string} = {
      'Event': 'category-event',
      'Holiday': 'category-holiday',
      'Exam': 'category-exam',
      'Meeting': 'category-meeting',
      'Sports': 'category-sports',
      'Cultural': 'category-cultural'
    };
    return categoryMap[category] || 'category-general';
  }

  getUniqueCategories(): number {
    const unique = new Set(this.notices.map(n => n.category));
    return unique.size;
  }

  getThisMonthCount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.notices.filter(notice => {
      const noticeDate = new Date(notice.date);
      return noticeDate.getMonth() === currentMonth && 
             noticeDate.getFullYear() === currentYear;
    }).length;
  }
}

