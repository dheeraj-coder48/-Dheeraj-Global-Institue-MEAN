// teachers-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-teachers-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teachers-dashboard.html',
  styleUrls: ['./teachers-dashboard.scss']
})
export class TeachersDashboard {

  teachers: any[] = [];
  teacherForm!: FormGroup;
  showModal: boolean = false;
  isEdit: boolean = false;
  currentId: string = '';
  previewError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: Api
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadTeachers();
    window.scrollTo(0, 0);
  }

  initForm() {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      designation: ['', Validators.required],
      // ⚠️ IMPORTANT: This is 'image' in the form to match backend
      image: ['', Validators.required],  // Changed from 'profilePicture' to 'image'
      bio: ['', Validators.required]     // Made bio required since backend requires it
    });
  }

  loadTeachers() {
    this.apiService.getTeacher().subscribe({
      next: (res: any) => {
        console.log('Teachers loaded:', res);
        if (res && res.status === 'Y') {
          this.teachers = res.data || [];
        } else {
          this.teachers = [];
        }
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
        this.teachers = [];
      }
    });
  }

  openAddModal() {
    this.isEdit = false;
    this.currentId = '';
    this.teacherForm.reset();
    this.previewError = false;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditModal(teacher: any) {
    this.isEdit = true;
    this.currentId = teacher._id;

    // Note: backend returns 'image', so use that
    this.teacherForm.patchValue({
      name: teacher.name,
      subject: teacher.subject,
      designation: teacher.designation,
      image: teacher.image,  // Changed from profilePicture to image
      bio: teacher.bio
    });
    
    this.previewError = false;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.teacherForm.reset();
    this.previewError = false;
    this.currentId = '';
    document.body.style.overflow = 'auto';
  }

  onSubmit() {
    if (this.teacherForm.invalid) {
      Object.keys(this.teacherForm.controls).forEach(key => {
        this.teacherForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Get form values - they already match backend field names
    const payload = this.teacherForm.value;
    console.log('Sending payload to backend:', payload);

    if (this.isEdit) {
      this.apiService.updateTeacher(this.currentId, payload).subscribe({
        next: (res: any) => {
          console.log('Update response:', res);
          if (res && res.status === 'Y') {
            alert(res.message || 'Teacher updated successfully');
            this.loadTeachers();
            this.closeModal();
          } else {
            alert(res.message || 'Failed to update teacher');
          }
        },
        error: (err) => {
          console.error('Update error:', err);
          console.error('Server error:', err.error);
          alert('Error updating teacher. Please try again.');
        }
      });
    } else {
      this.apiService.addTeacher(payload).subscribe({
        next: (res: any) => {
          console.log('Add response:', res);
          if (res && res.status === 'Y') {
            alert(res.message || 'Teacher added successfully');
            this.loadTeachers();
            this.closeModal();
          } else {
            alert(res.message || 'Failed to add teacher');
          }
        },
        error: (err) => {
          console.error('Add error:', err);
          console.error('Server error:', err.error);
          alert('Error adding teacher. Please try again.');
        }
      });
    }
  }

  deleteTeacher(teacher: any, index: number) {
    if (confirm(`Are you sure you want to delete "${teacher.name}"?`)) {
      this.apiService.deleteTeacher(teacher._id).subscribe({
        next: (res: any) => {
          console.log('Delete response:', res);
          if (res && res.status === 'Y') {
            alert(res.message || 'Teacher deleted successfully');
            this.teachers.splice(index, 1);
          }
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Error deleting teacher. Please try again.');
        }
      });
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default-profile.jpg';
  }

  getUniqueSubjects(): number {
    if (!this.teachers || this.teachers.length === 0) return 0;
    const unique = new Set(this.teachers.map(t => t.subject));
    return unique.size;
  }

  getUniqueDesignations(): number {
    if (!this.teachers || this.teachers.length === 0) return 0;
    const unique = new Set(this.teachers.map(t => t.designation));
    return unique.size;
  }
}