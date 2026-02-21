import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDashboard } from './contact-dashboard';

describe('ContactDashboard', () => {
  let component: ContactDashboard;
  let fixture: ComponentFixture<ContactDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
