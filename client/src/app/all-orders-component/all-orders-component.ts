import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { setPaginationHeaders, setPaginatedResponse } from '../_helpers/paginationHelper';
import { OrderDto } from '../_models/orderDto';
import { OrderParams } from '../_models/orderParams';
import { PaginatedResult } from '../_models/pagination';
import { OrderService } from '../_services/order-service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { AllOrdersCardComponent } from "../all-orders-card-component/all-orders-card-component";
import { MatButtonModule } from '@angular/material/button';
import { SignalRService } from '../_services/signal-r-service';

@Component({
  selector: 'app-all-orders-component',
  imports: [MatCardModule, MatInputModule, MatPaginator, CommonModule, FormsModule, MatRippleModule, AllOrdersCardComponent, MatButtonModule],
  templateUrl: './all-orders-component.html',
  styleUrl: './all-orders-component.css'
})
export class AllOrdersComponent {
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);
  private signalRService = inject(SignalRService);

  paginatedResult = signal<PaginatedResult<OrderDto[]> | null>(null);
  name: string = "";
  orderParams = signal<OrderParams>(new OrderParams(this.name));

  count: number = 0;

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.orderSignal$.subscribe(() => {
      this.getOrders();
    })

    this.getOrders();
  }

  resetOrderParams() {
    this.orderParams.set(new OrderParams(this.name));
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
    this.orderService.getAllOrders(params).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        if (this.count == 0) {
          this.toastr.info('All orders data loaded successfully')
          this.count++;
        }
      }, error: error => {
        this.toastr.error('Something went wrong while loading all orders data : ' + error.message);
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

}
