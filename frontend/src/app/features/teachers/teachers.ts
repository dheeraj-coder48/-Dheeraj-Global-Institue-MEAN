import { Component } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-teachers',
  imports: [],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss'
})
export class Teachers {
  teachers: any = [];
  
  constructor(private apiService: Api) {}
  
  ngOnInit() {
    window.scrollTo(0,0);
    this.getTeachers();
  }


  getTeachers() {
    this.apiService.getTeacher().subscribe({
      next: (response: any) => {
        if (response && response['status'] === 'Y') {
          this.teachers = response.data;
          console.log(this.teachers);
        }
      },error(error:any){
        console.error(error);
      },
    });
  }
}
