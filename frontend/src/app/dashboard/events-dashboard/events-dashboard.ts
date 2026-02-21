// events-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-events-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events-dashboard.html',
  styleUrls: ['./events-dashboard.scss']
})
export class EventsDashboard {
  events: any[] = [];
  eventForm!: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentId: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: Api
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadEvents();
    window.scrollTo(0, 0);
  }

  initForm() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  loadEvents() {
    this.apiService.getEvents().subscribe({
      next: (res: any) => {
        console.log('Events loaded:', res);
        if (res && res.status === 'Y') {
          this.events = res.data || [];
        } else {
          this.events = [];
        }
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.events = [];
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentId = '';
    this.eventForm.reset();
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  editEvent(event: any) {
    this.isEditMode = true;
    this.currentId = event._id;
    
    // Format date for input if needed
    const formattedDate = event.date ? this.formatDateForInput(event.date) : '';
    
    this.eventForm.patchValue({
      title: event.title,
      shortDescription: event.shortDescription,
      description: event.description,
      date: formattedDate,
      location: event.location
    });
    
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.eventForm.reset();
    this.currentId = '';
    document.body.style.overflow = 'auto';
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      Object.keys(this.eventForm.controls).forEach(key => {
        this.eventForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.eventForm.value;
    console.log('Submitting event data:', formData);

    if (this.isEditMode) {
      this.apiService.updateEvent(this.currentId, formData).subscribe({
        next: (res: any) => {
          console.log('Update response:', res);
          if (res && res.status === 'Y') {
            alert(res.message || 'Event updated successfully');
            this.loadEvents();
            this.closeModal();
          } else {
            alert(res.message || 'Failed to update event');
          }
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Error updating event. Please try again.');
        }
      });
    } else {
      this.apiService.addEvent(formData).subscribe({
        next: (res: any) => {
          console.log('Add response:', res);
          if (res && res.status === 'Y') {
            alert(res.message || 'Event created successfully');
            this.loadEvents();
            this.closeModal();
          } else {
            alert(res.message || 'Failed to create event');
          }
        },
        error: (err) => {
          console.error('Add error:', err);
          alert('Error creating event. Please try again.');
        }
      });
    }
  }

  deleteEvent(event: any, index: number) {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.apiService.deleteEvent(event._id).subscribe({
        next: (res: any) => {
          console.log('Delete response:', res);
          if (res && res.status === 'Y') {
            alert(res.message || 'Event deleted successfully');
            this.events.splice(index, 1);
          } else {
            alert(res.message || 'Failed to delete event');
          }
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Error deleting event. Please try again.');
        }
      });
    }
  }

  formatDateForInput(date: string): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  getUpcomingEvents(): number {
    const today = new Date();
    return this.events.filter(event => new Date(event.date) > today).length;
  }

  getCompletedEvents(): number {
    const today = new Date();
    return this.events.filter(event => new Date(event.date) < today).length;
  }
}