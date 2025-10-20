import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../_services/order-service';
import { PaginatedResult } from '../_models/pagination';
import { OrderParams } from '../_models/orderParams';
import { setPaginatedResponse, setPaginationHeaders } from '../_helpers/paginationHelper';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { FormsModule } from '@angular/forms';
import { OrderDto } from '../_models/orderDto';
import { MatButtonModule } from '@angular/material/button';
import { StatsService } from '../_services/stats-service';
import { OrderSummaryDto } from '../_models/orderSummaryDto';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatRippleModule } from '@angular/material/core';
import { SignalRService } from '../_services/signal-r-service';
import { OrderDumbCardComponent } from '../order-dumbcard-component/order-dumbcard-component';


@Component({
  selector: 'app-my-orders-component',
  imports: [NgChartsModule, MatRippleModule, MatInputModule, MatPaginator, FormsModule, OrderDumbCardComponent, MatButtonModule, CurrencyPipe, CommonModule],
  templateUrl: './my-orders-component.html',
  styleUrl: './my-orders-component.css'
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);
  private statsService = inject(StatsService);
  private signalRService = inject(SignalRService);

  paginatedResult = signal<PaginatedResult<OrderDto[]> | null>(null);
  name: string = "";
  orderParams = signal<OrderParams>(new OrderParams(this.name));
  displayedColumns: string[] = [
    'customerName',
    'product',
    'orderPrice',
    'orderDate',
    'orderStatus',
    'bonusAwarded'
  ];
  count: number = 0;
  summary?: OrderSummaryDto;

  lineChartData!: ChartConfiguration<'line'>['data'];
  lineChart2Data!: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  ngOnInit() {
    this.signalRService.orderSignal$.subscribe(() => {
      this.getOrders();
      this.getSummary();
    })

    this.getOrders();
    this.getSummary();
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
    this.orderService.getOrdersForUser(params).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        if (this.count == 0) {
          this.toastr.info('Your orders data loaded successfully')
          this.count++;
        }
      }, error: error => {
        this.toastr.error('Something went wrong while loading your orders data : ' + error.message);
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

  getSummary() {
    this.statsService.getUserSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.updateChart(data);
        this.updateChart2(data);
      },
      error: (err) => this.toastr.error('Error fetching summary : ' + err.message)
    })
  }


  updateChart(summary: OrderSummaryDto) {
    const today = new Date();
    const toDateKey = (d: string | Date) => {
      const dateObj = typeof d === 'string' ? new Date(d) : d;
      const y = dateObj.getFullYear();
      const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${day}`;
    };


    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return toDateKey(d);
    });


    const userSalesMap = new Map(
      summary.dailySales.map(d => [toDateKey(d.date), d.count])
    );
    const avgSalesMap = new Map(
      summary.averageDailySales.map(d => [toDateKey(d.date), d.count])
    );

    const userData = last7Days.map(d => userSalesMap.get(d) ?? 0);
    const avgData = last7Days.map(d => avgSalesMap.get(d) ?? 0);


    const labels = last7Days.map(d => {
      const [y, m, day] = d.split('-').map(Number);
      return new Date(y, m - 1, day).toLocaleDateString();
    });

    this.lineChartData = {
      labels,
      datasets: [
        {
          label: 'Your daily sales',
          data: userData,
          borderColor: 'rgb(0, 174, 255)',
          backgroundColor: 'rgba(66,165,245,0.3)',
          fill: true,
          tension: 0.6,
          borderWidth: 3,
          hoverBackgroundColor: 'rgb(0, 174, 255)'
        },
        {
          label: 'Average daily sales (other users)',
          data: avgData,
          borderColor: '#9CCC65',
          backgroundColor: 'rgba(156,204,101,0.3)',
          hoverBackgroundColor: '#9ccc65',
          fill: true,
          tension: 0.6,
          borderWidth: 3
        }
      ]
    };
  }

  updateChart2(summary: OrderSummaryDto) {
    const today = new Date();
    const toDateKey = (d: string | Date) => {
      const dateObj = typeof d === 'string' ? new Date(d) : d;
      const y = dateObj.getFullYear();
      const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${day}`;
    };


    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return toDateKey(d);
    });


    const userSalesMap = new Map(
      summary.dailySales.map(d => [toDateKey(d.date), d.totalRevenue])
    );
    const avgSalesMap = new Map(
      summary.averageDailySales.map(d => [toDateKey(d.date), d.totalRevenue])
    );

    const userData = last7Days.map(d => userSalesMap.get(d) ?? 0);
    const avgData = last7Days.map(d => avgSalesMap.get(d) ?? 0);


    const labels = last7Days.map(d => {
      const [y, m, day] = d.split('-').map(Number);
      return new Date(y, m - 1, day).toLocaleDateString();
    });

    this.lineChart2Data = {
      labels,
      datasets: [
        {
          label: 'Your daily revenue',
          data: userData,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66,165,245,0.3)',
          hoverBackgroundColor: '#42a5f5',
          borderWidth: 3,
        },
        {
          label: 'Average daily revenue (other users)',
          data: avgData,
          borderColor: '#9CCC65',
          backgroundColor: 'rgba(156,204,101,0.3)',
          hoverBackgroundColor: '#9ccc65',
          fill: true,
          tension: 0.4,
          borderWidth: 3
        }
      ]
    };
  }

}
