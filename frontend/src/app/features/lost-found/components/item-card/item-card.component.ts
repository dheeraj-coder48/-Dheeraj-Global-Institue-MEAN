import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LostFoundItem } from '../../services/lost-found.service';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {
  @Input() item!: LostFoundItem;
  @Output() onResolved = new EventEmitter<string>();
  @Output() onDeleted = new EventEmitter<string>();
  @Output() onClick = new EventEmitter<LostFoundItem>(); // ADD THIS

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

  getTypeClass(type: string): string {
    return type === 'lost' ? 'type-lost' : 'type-found';
  }

  getStatusClass(status: string): string {
    if (status === 'resolved') return 'status-resolved';
    if (status === 'active') return 'status-active';
    return 'status-deleted';
  }

  getFirstImage(): string {
  if (this.item.images && this.item.images.length > 0) {
    const firstImage = this.item.images[0];
    // Validate URL - return empty string if invalid
    if (firstImage && 
        firstImage !== 'null' && 
        firstImage !== 'undefined' && 
        firstImage.trim() !== '' &&
        !firstImage.startsWith('data:image/jpeg;base64,')) {
      return firstImage;
    }
  }
  return ''; // Return empty string to trigger CSS fallback
}

  getImageCount(): number {
    return this.item.images?.length || 0;
  }

  onCardClick() {
    this.onClick.emit(this.item);
  }

  markAsResolved(event: Event) {
    event.stopPropagation();
    if (confirm(`Mark this item as resolved?`)) {
      this.onResolved.emit(this.item._id);
    }
  }

  deleteItem(event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete this item?`)) {
      this.onDeleted.emit(this.item._id);
    }
  }
  handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = '';
  target.classList.add('image-error');
  target.onerror = null;
  console.log('Image failed to load, using CSS fallback');
}
}