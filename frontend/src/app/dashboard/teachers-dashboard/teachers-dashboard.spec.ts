import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersDashboard } from './teachers-dashboard';

describe('TeachersDashboard', () => {
  let component: TeachersDashboard;
  let fixture: ComponentFixture<TeachersDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachersDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
