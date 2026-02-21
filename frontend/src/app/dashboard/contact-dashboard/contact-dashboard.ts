// contact-dashboard.component.ts
import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-dashboard',
  imports: [CommonModule],
  templateUrl: './contact-dashboard.html',
  styleUrl: './contact-dashboard.scss'
})
export class ContactDashboard {
  contacts: any = [];
  showModal = false;
  selectedContact = {
    email: '',
    name: '',
    phone: 'null',
    subject: '',
    message: '',
    submittedAt: null
  }
  
  constructor(private apiService: Api) {}

  ngOnInit() {
    this.onLoad();
    window.scrollTo(0, 0);
  }

  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  onLoad() {
    this.apiService.getContacts().subscribe({
      next: (response: any) => {
        if (response && response['status'] === 'Y') {
          this.contacts = response.data;
          console.log(this.contacts);
        }
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  getRespondedCount(): number {
    // Your logic to count responded enquiries
    return Math.floor(this.contacts.length * 0.3); // Example: 30% responded
  }

  getNewThisWeek(): number {
    // Your logic to count new enquiries this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.contacts.filter((contact: any) => {
      const submittedDate = new Date(contact.submittedAt);
      return submittedDate >= oneWeekAgo;
    }).length;
  }

  viewContact(contact: any) {
    this.selectedContact = contact;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  deleteContact(contact: any) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      console.log(contact);
      this.apiService.deleteContact(contact._id).subscribe({
        next: (response: any) => {
          if (response && response['status'] === 'Y') {
            alert(response.message);
            this.onLoad();
          }
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
  }
}