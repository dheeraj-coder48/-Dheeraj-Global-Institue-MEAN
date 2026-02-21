import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsDashboard } from './events-dashboard';

describe('EventsDashboard', () => {
  let component: EventsDashboard;
  let fixture: ComponentFixture<EventsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
