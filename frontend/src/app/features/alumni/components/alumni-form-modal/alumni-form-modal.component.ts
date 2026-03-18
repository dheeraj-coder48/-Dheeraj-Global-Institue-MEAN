import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumniService, Alumni } from '../../services/alumni.service';

@Component({
  selector: 'app-alumni-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alumni-form-modal.component.html',
  styleUrls: ['./alumni-form-modal.component.scss']
})
export class AlumniFormModalComponent implements OnInit {
  @Input() alumni: Alumni | null = null;
  @Input() isEdit = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<Alumni>();
  @Output() onUpdate = new EventEmitter<Alumni>();

  alumniForm!: FormGroup;
  isSubmitting = false;

  programs = [
    'Science', 'Commerce', 'Arts', 'BBA', 'BCA', 'B.Com', 'MBA', 'MCA', 'Other'
  ];

  industries = [
    'Technology', 'Finance', 'Education', 'Healthcare', 'Manufacturing', 
    'Retail', 'Consulting', 'Government', 'Non-Profit', 'Other'
  ];

  batches = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

  constructor(
    private fb: FormBuilder,
    private alumniService: AlumniService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.alumni && this.isEdit) {
      this.patchForm();
    }
  }

  initForm() {
    this.alumniForm = this.fb.group({
      // Personal Information
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      
      // Academic Information
      batch: ['', Validators.required],
      program: ['', Validators.required],
      rollNumber: ['', Validators.required],
      
      // Professional Information
      currentEmployer: [''],
      designation: [''],
      industry: [''],
      location: [''],
      
      // Social Links
      linkedin: [''],
      facebook: [''],
      instagram: [''],
      
      // Profile
      profilePicture: [''],
      bio: [''],
      achievements: ['']
    });
  }

  patchForm() {
    if (this.alumni) {
      this.alumniForm.patchValue({
        name: this.alumni.name,
        email: this.alumni.email,
        phone: this.alumni.phone,
        batch: this.alumni.batch,
        program: this.alumni.program,
        rollNumber: this.alumni.rollNumber,
        currentEmployer: this.alumni.currentEmployer || '',
        designation: this.alumni.designation || '',
        industry: this.alumni.industry || '',
        location: this.alumni.location || '',
        linkedin: this.alumni.linkedin || '',
        facebook: this.alumni.facebook || '',
        instagram: this.alumni.instagram || '',
        profilePicture: this.alumni.profilePicture || '',
        bio: this.alumni.bio || '',
        achievements: this.alumni.achievements || ''
      });
    }
  }

  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  closeModal() {
    this.onClose.emit();
  }

  onSubmit() {
    if (this.alumniForm.invalid) {
      Object.keys(this.alumniForm.controls).forEach(key => {
        this.alumniForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    
    const formData = this.alumniForm.value;

    if (this.isEdit && this.alumni?._id) {
      // Update existing alumni
      this.alumniService.updateAlumni(this.alumni._id, formData).subscribe({
        next: (response: any) => {
          if (response.status === 'Y') {
            alert(response.message);
            this.onUpdate.emit(response.data);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating alumni:', error);
          alert('Failed to update alumni profile. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new alumni
      this.alumniService.createAlumni(formData).subscribe({
        next: (response: any) => {
          if (response.status === 'Y') {
            alert(response.message);
            this.onCreate.emit(response.data);
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating alumni:', error);
          alert('Failed to create alumni profile. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
}