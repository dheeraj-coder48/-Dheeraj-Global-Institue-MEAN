import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeDashboard } from './notice-dashboard';

describe('NoticeDashboard', () => {
  let component: NoticeDashboard;
  let fixture: ComponentFixture<NoticeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
