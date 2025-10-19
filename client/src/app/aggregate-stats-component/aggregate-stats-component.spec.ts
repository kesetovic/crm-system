import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregateStatsComponent } from './aggregate-stats-component';

describe('AggregateStatsComponent', () => {
  let component: AggregateStatsComponent;
  let fixture: ComponentFixture<AggregateStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregateStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggregateStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
