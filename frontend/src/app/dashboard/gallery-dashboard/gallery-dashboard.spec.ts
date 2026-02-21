import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryDashboard } from './gallery-dashboard';

describe('GalleryDashboard', () => {
  let component: GalleryDashboard;
  let fixture: ComponentFixture<GalleryDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
