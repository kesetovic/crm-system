import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPackCardComponent } from './order-pack-card-component';

describe('OrderPackCardComponent', () => {
  let component: OrderPackCardComponent;
  let fixture: ComponentFixture<OrderPackCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPackCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPackCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
