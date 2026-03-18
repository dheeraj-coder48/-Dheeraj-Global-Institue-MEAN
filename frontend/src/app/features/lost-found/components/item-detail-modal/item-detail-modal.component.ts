import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LostFoundService } from '../../services/lost-found.service';

@Component({
  selector: 'app-item-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-detail-modal.component.html',
  styleUrls: ['./item-detail-modal.component.scss']
})
export class ItemDetailModalComponent implements OnInit, OnDestroy {
  @Input() item: any = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onResolved = new EventEmitter<string>();
  @Output() onDeleted = new EventEmitter<string>();

  currentImageIndex = 0;
  showResolveForm = false;
  isSubmitting = false;
  
  resolveData = {
    name: '',
    phone: '',
    email: '',
    rollNumber: '',
    message: ''
  };

  constructor(private lostFoundService: LostFoundService) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  get images(): string[] {
    return this.item?.images || [];
  }

  nextImage() {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.images.length - 1;
    }
  }

  setImageIndex(index: number) {
    this.currentImageIndex = index;
  }

  getTypeClass(): string {
    return this.item?.type === 'lost' ? 'type-lost' : 'type-found';
  }

  getStatusClass(): string {
    if (this.item?.status === 'resolved') return 'status-resolved';
    if (this.item?.status === 'active') return 'status-active';
    return 'status-deleted';
  }

  getCategoryClass(category: string): string {
    const categoryMap: {[key: string]: string} = {
      'Electronics': 'category-electronics',
      'Books': 'category-books',
      'Clothing': 'category-clothing',
      'Accessories': 'category-accessories',
      'ID Cards': 'category-idcards',
      'Stationery': 'category-stationery',
      'Other': 'category-other'
    };
    return categoryMap[category] || 'category-other';
  }

  closeModal() {
    this.onClose.emit();
  }

  toggleResolveForm() {
    this.showResolveForm = !this.showResolveForm;
  }

  markAsResolved() {
    if (!this.resolveData.name || !this.resolveData.phone) {
      alert('Please provide your name and phone number');
      return;
    }

    this.isSubmitting = true;
    
    this.lostFoundService.markAsResolved(this.item._id, this.resolveData).subscribe({
      next: (response: any) => {
        if (response.status === 'Y') {
          alert(response.message);
          this.onResolved.emit(this.item._id);
          this.closeModal();
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error marking as resolved:', error);
        alert('Failed to mark as resolved. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  deleteItem() {
    if (confirm('Are you sure you want to delete this item?')) {
      this.lostFoundService.deletePost(this.item._id).subscribe({
        next: (response: any) => {
          if (response.status === 'Y') {
            alert(response.message);
            this.onDeleted.emit(this.item._id);
            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Error deleting item:', error);
          alert('Failed to delete item. Please try again.');
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = ''; // Empty to trigger CSS fallback
  target.classList.add('image-error');
  target.onerror = null;
}
}