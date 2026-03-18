// dashboard.component.ts
import { Component } from '@angular/core';
import { ContactDashboard } from './contact-dashboard/contact-dashboard';
import { EventsDashboard } from './events-dashboard/events-dashboard';
import { GalleryDashboard } from './gallery-dashboard/gallery-dashboard';
import { NoticeDashboard } from './notice-dashboard/notice-dashboard';
import { TeachersDashboard } from './teachers-dashboard/teachers-dashboard';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlumniApprovalComponent } from './alumni-approval/alumni-approval.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TeachersDashboard,FormsModule,ContactDashboard,EventsDashboard,GalleryDashboard,NoticeDashboard,FormsModule,AlumniApprovalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  selectedMenu : any = "contact";
}