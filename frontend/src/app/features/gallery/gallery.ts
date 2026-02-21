// gallery.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  galleries: any = [];
  selectedGallery: any = null;
  currentImageIndex: number = 0;

  constructor(private apiService: Api, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getGalleries();
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getGalleries() {
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

  openGalleryModal(gallery: any) {
    this.selectedGallery = gallery;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedGallery = null;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'auto';
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.selectedGallery && this.currentImageIndex < this.selectedGallery.images.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0; // Loop back to first
    }
  }

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.selectedGallery && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.selectedGallery.images.length - 1; // Loop to last
    }
  }

  setImageIndex(event: Event, index: number) {
    event.stopPropagation();
    this.currentImageIndex = index;
  }
}