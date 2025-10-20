import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDumbcardComponent } from './order-dumbcard-component';

describe('OrderDumbcardComponent', () => {
  let component: OrderDumbcardComponent;
  let fixture: ComponentFixture<OrderDumbcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDumbcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDumbcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
