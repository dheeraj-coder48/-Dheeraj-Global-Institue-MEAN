import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admission } from './admission';

describe('Admission', () => {
  let component: Admission;
  let fixture: ComponentFixture<Admission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admission);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
