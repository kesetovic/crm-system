import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPackComponent } from './orders-pack-component';

describe('OrdersPackComponent', () => {
  let component: OrdersPackComponent;
  let fixture: ComponentFixture<OrdersPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
