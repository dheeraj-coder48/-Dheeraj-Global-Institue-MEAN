import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-gallery-dashboard',
  standalone: true, // ✅ REQUIRED when using imports array
  imports: [CommonModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './gallery-dashboard.html',
  styleUrl: './gallery-dashboard.scss'
})
export class GalleryDashboard {

  galleries: any[] = [];
  selectedGallery!: FormGroup;

  id: string = '';
  isEdit: boolean = false;
  showModal: boolean = false;

  constructor(
    private apiService: Api,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {

    // ✅ Form initialization
    this.selectedGallery = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      imagesUrl: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.onLoad();
    window.scrollTo(0, 0);
  }

  // =========================
  // SANITIZE URL
  // =========================

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // =========================
  // LOAD DATA
  // =========================

  onLoad() {
    this.apiService.getGallery().subscribe({
      next: (response: any) => {
        if (response && response['status'] === 'Y') {

          response.data.map((obj: any) => {
            obj['images'] = obj.imagesUrl.split(',');
          });

          this.galleries = response.data;
          console.log(this.galleries);
        }
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  // =========================
  // MODAL
  // =========================

  openAddModal() {
    this.isEdit = false;
    this.selectedGallery.reset();
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.selectedGallery.reset();
    document.body.style.overflow = 'auto';
  }

  // =========================
  // STATS
  // =========================

  getTotalPhotos(): number {
    return this.galleries.reduce((total: number, gallery: any) => {
      return total + (gallery.images?.length || 0);
    }, 0);
  }

  getThisYearCount(): number {
    const currentYear = new Date().getFullYear();

    return this.galleries.filter((gallery: any) => {
      const galleryYear = new Date(gallery.date).getFullYear();
      return galleryYear === currentYear;
    }).length;
  }

  // =========================
  // PREVIEW IMAGES
  // =========================

  getPreviewUrls(): string[] {
    const urls = this.selectedGallery.get('imagesUrl')?.value;

    if (urls) {
      return urls
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0);
    }

    return [];
  }

  // =========================
  // SUBMIT
  // =========================

  onSubmit() {

    console.log(this.selectedGallery.value);

    if (this.selectedGallery.invalid) return;

    if (this.isEdit) {

      this.apiService.updateGallery(this.id, this.selectedGallery.value).subscribe({
        next: (response: any) => {
          if (response && response['status'] === 'Y') {
            alert(response.message);
            this.onLoad();
            this.closeModal();
          }
        },
        error: (error: any) => console.error(error),
      });

    } else {

      this.apiService.addGallery(this.selectedGallery.value).subscribe({
        next: (response: any) => {
          if (response && response['status'] === 'Y') {
            alert(response.message);
            this.onLoad();
            this.closeModal();
          }
        },
        error: (error: any) => console.error(error),
      });
    }
  }

  // =========================
  // EDIT
  // =========================

  edit(gallery: any) {

    this.isEdit = true;
    this.id = gallery._id;

    this.selectedGallery.patchValue({
      date: this.formatDateforInput(gallery.date),
      imagesUrl: gallery.imagesUrl,
      title: gallery.title,
    });

    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  // =========================
  // DATE FORMAT
  // =========================

  formatDateforInput(date: any) {

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // =========================
  // DELETE
  // =========================

  delete(gallery: any) {

    if (confirm(`Are you sure you want to delete "${gallery.title}"?`)) {

      this.apiService.deleteGallery(gallery._id).subscribe({
        next: (response: any) => {
          if (response && response['status'] === 'Y') {
            alert(response.message);
            this.onLoad();
          }
        },
        error: (error: any) => console.error(error),
      });
    }
  }
}
