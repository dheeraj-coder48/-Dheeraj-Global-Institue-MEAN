import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})
export class ContactForm {
  contactForm : FormGroup;
  
  constructor(private apiService: Api , private fb : FormBuilder) {
    this.contactForm = this.fb.group({
      name : ['',Validators.required],
      email : ['',[Validators.required,Validators.email]],
      phone : ['',Validators.required],
      subject : ['',Validators.required],
      message : ['',Validators.required],
      
    });
  }
  
  
onSubmit(){
  console.log(this.contactForm.value)
  this.apiService.submitForm(this.contactForm.value).subscribe({
      next: (response: any) => {
        if (response && response['status'] === 'Y') {
          alert(response.message);
          this.contactForm.reset();

        }
      },error(error:any){
        console.error(error);
      },
    });
}

}
