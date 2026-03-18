import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LostFoundService } from '../../services/lost-found.service';

@Component({
  selector: 'app-item-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form-modal.component.html',
  styleUrls: ['./item-form-modal.component.scss']
})
export class ItemFormModalComponent implements OnInit {
  @Input() type: 'lost' | 'found' = 'lost';
  @Input() editData: any = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  itemForm!: FormGroup;
  isSubmitting = false;
  previewImages: string[] = [];

  categories = [
    'Electronics', 'Books', 'Clothing', 'Accessories', 
    'ID Cards', 'Stationery', 'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private lostFoundService: LostFoundService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.editData) {
      this.patchForm();
    }
  }

  initForm() {
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      date: [this.getTodayDate(), Validators.required],
      contactName: ['', Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      rollNumber: [''],
      imagesUrl: ['', Validators.required]
    });

    // Subscribe to imagesUrl changes to update preview
    this.itemForm.get('imagesUrl')?.valueChanges.subscribe(value => {
      this.updatePreviewImages(value);
    });
  }

  patchForm() {
    this.itemForm.patchValue({
      itemName: this.editData.itemName,
      description: this.editData.description,
      category: this.editData.category,
      location: this.editData.location,
      date: this.formatDateForInput(this.editData.date),
      contactName: this.editData.contactName,
      contactPhone: this.editData.contactPhone,
      contactEmail: this.editData.contactEmail,
      rollNumber: this.editData.rollNumber || '',
      imagesUrl: this.editData.imagesUrl
    });

    // Load preview images
    this.updatePreviewImages(this.editData.imagesUrl);
  }

  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateForInput(date: string) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // FIX: Add this method to update preview images
  updatePreviewImages(urlString: string) {
  if (urlString && urlString.trim()) {
    // Split by comma and clean up URLs
    this.previewImages = urlString.split(',')
      .map(url => url.trim())
      .filter(url => {
        // Filter out invalid URLs
        return url.length > 0 && 
               url !== 'null' && 
               url !== 'undefined' && 
               !url.startsWith('data:image/jpeg;base64,');
      });
  } else {
    this.previewImages = [];
  }
}

  // FIX: Add this method for manual trigger (if needed)
  onImagesUrlChange() {
    const urlString = this.itemForm.get('imagesUrl')?.value;
    this.updatePreviewImages(urlString);
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
    this.itemForm.patchValue({
      imagesUrl: this.previewImages.join(',')
    });
  }

  // FIX: Add image error handler
  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/image-placeholder.jpg'; // Use a different name
  }

  closeModal() {
    this.onClose.emit();
  }

  onSubmitForm() {
    if (this.itemForm.invalid) {
      Object.keys(this.itemForm.controls).forEach(key => {
        this.itemForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    
    const formData = {
      ...this.itemForm.value,
      type: this.type
    };

    if (this.editData) {
      this.lostFoundService.updatePost(this.editData._id, formData).subscribe({
        next: (response: any) => {
          if (response.status === 'Y') {
            alert(response.message);
            this.onSubmit.emit(response.data);
            this.closeModal();
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating post:', error);
          alert('Failed to update post. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      this.lostFoundService.createPost(formData).subscribe({
        next: (response: any) => {
          if (response.status === 'Y') {
            alert(response.message);
            this.onSubmit.emit(response.data);
            this.closeModal();
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating post:', error);
          alert('Failed to create post. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
}