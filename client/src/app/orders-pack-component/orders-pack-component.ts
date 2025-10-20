import { Component, inject, NgModule, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { ToastrService } from 'ngx-toastr';
import { setPaginationHeaders, setPaginatedResponse } from '../_helpers/paginationHelper';
import { OrderDto } from '../_models/orderDto';
import { OrderParams } from '../_models/orderParams';
import { PaginatedResult } from '../_models/pagination';
import { OrderService } from '../_services/order-service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatButtonModule } from '@angular/material/button';
import { SignalRService } from '../_services/signal-r-service';
import { OrderDumbCardComponent } from "../order-dumbcard-component/order-dumbcard-component";

@Component({
  selector: 'app-orders-pack-component',
  imports: [MatCardModule, MatInputModule, CommonModule, FormsModule, MatButtonModule, MatPaginator, OrderDumbCardComponent],
  templateUrl: './orders-pack-component.html',
  styleUrl: './orders-pack-component.css'
})
export class OrdersPackComponent {
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);
  private signalRService = inject(SignalRService);

  paginatedResult = signal<PaginatedResult<OrderDto[]> | null>(null);
  id: string = "";
  orderParams = signal<OrderParams>(new OrderParams(this.id));
  count: number = 0;

  ngOnInit() {
    this.signalRService.orderSignal$.subscribe(() => {
      this.getOrders();
    })

    this.getOrders();
  }


  resetOrderParams() {
    this.orderParams.set(new OrderParams(this.id));
  }
  resetFilters() {
    this.resetOrderParams();
    this.getOrders();
  }
  getOrders() {
    let params = setPaginationHeaders(this.orderParams().pageNumber, this.orderParams().pageSize);
    params = params.append('customerNameString', this.orderParams().customerNameString);
    params = params.append('minValue', this.orderParams().minValue ?? 0);
    params = params.append('maxValue', this.orderParams().maxValue ?? 10000);
    params = params.append('orderBy', this.orderParams().orderBy);
    this.orderService.getOrdersToPack(params).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        if (this.count == 0) {
          this.toastr.info('Orders to pack data loaded successfully')
          this.count++;
        }
      }, error: error => {
        this.toastr.error('Something went wrong while loading orders to pack data : ' + error.message);
      }
    });
  }

  pageChanged(event: any) {
    if (this.orderParams().pageNumber !== event.pageIndex + 1) {
      const currentParams = this.orderParams();
      currentParams.pageNumber = event.pageIndex + 1;
      this.orderParams.set({ ...currentParams });
      this.getOrders();
    }
  }
  setOrderBy(orderBy: string) {
    const currentParams = this.orderParams();
    currentParams.orderBy = orderBy;
    this.orderParams.set({ ...currentParams });
    this.getOrders();
  }

  private onPack(id: string) {
    this.orderService.markPacked(id).subscribe({
      next: _ => {
        this.toastr.info(`Order ${id} packed.`);
        this.getOrders();
      },
      error: error => {
        this.toastr.error(`Error packing order ${id} : ` + error.message);
      }
    })
  }

  private onCancel(id: string) {
    this.orderService.markCancelled(id).subscribe({
      next: _ => {
        this.toastr.warning(`Order ${id} cancelled.`);
        this.getOrders();
      },
      error: error => {
        this.toastr.error(`Error cancelling order ${id} : ` + error.message);
      }
    })
  }

  handleEventChange([event, id]: [string, string]) {
    switch (event) {
      case 'pack':
        this.onPack(id);
        break;
      case 'cancel':
        this.onCancel(id);
        break;
    }
  }
}
