import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrdersCardComponent } from './all-orders-card-component';

describe('AllOrdersCardComponent', () => {
  let component: AllOrdersCardComponent;
  let fixture: ComponentFixture<AllOrdersCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOrdersCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrdersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
