import { Component, inject, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { StatsService } from '../_services/stats-service';
import { AggregatedStatsDto } from '../_models/aggregatedStatsDto';
import { NgChartsModule } from 'ng2-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { SignalRService } from '../_services/signal-r-service';

@Component({
  selector: 'app-aggregate-stats-component',
  imports: [NgChartsModule, MatButtonModule, MatCardModule, MatInputModule],
  templateUrl: './aggregate-stats-component.html',
  styleUrl: './aggregate-stats-component.css'
})
export class AggregateStatsComponent implements OnInit {
  private statsService = inject(StatsService);
  private toastr = inject(ToastrService);
  private signalRService = inject(SignalRService);

  globalOrdersChart!: ChartConfiguration<'bar'>['data'];
  globalRevenueChart!: ChartConfiguration<'bar'>['data'];
  perUserDailyOrdersChart!: ChartConfiguration<'line'>['data'];
  perUserDailyRevenueChart!: ChartConfiguration<'line'>['data'];
  perUserMonthlyOrdersChart!: ChartConfiguration<'line'>['data'];
  perUserMonthlyRevenueChart!: ChartConfiguration<'line'>['data'];

  ngOnInit(): void {
    this.signalRService.orderSignal$.subscribe(() => {
      console.log('Order signal received, refetching..');
      this.reloadStats();
    })

    this.getStats();
  }

  private getStats() {
    this.statsService.getAggregateStats().subscribe({
      next: (stats) => {
        this.toastr.info('Stats loaded sucessfully');
        this.generateGlobalCharts(stats);
        this.generatePerUserCharts(stats);
      },
      error: (err) => this.toastr.error('Error loading stats : ' + err.message)
    });
  }
  private reloadStats() {
    this.statsService.getAggregateStats().subscribe({
      next: (stats) => {
        this.generateGlobalCharts(stats);
        this.generatePerUserCharts(stats);
      },
      error: (err) => this.toastr.error('Error reloading stats : ' + err.message)
    });
  }

  private toLabel(d: string | Date): string {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  }

  private randomColor(): string {
    return `hsl(${Math.random() * 360}, 70%, 55%)`;
  }

  private generateGlobalCharts(stats: AggregatedStatsDto) {
    const labels = stats.globalDailyOrders.map(d => this.toLabel(d.date));

    this.globalOrdersChart = {
      labels,
      datasets: [
        {
          label: 'Total orders (all users)',
          data: stats.globalDailyOrders.map(d => d.value),
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66,165,245,0.3)',
          hoverBackgroundColor: '#42a5f5',
          borderWidth: 3,
        }
      ]
    };

    this.globalRevenueChart = {
      labels,
      datasets: [
        {
          label: 'Total revenue (all users)',
          data: stats.globalDailyRevenue.map(d => d.value),
          backgroundColor: 'rgba(156,204,101,0.3)',
          borderColor: '#9CCC65',
          borderWidth: 3,
          hoverBackgroundColor: '#9CCC65'
        }
      ]
    };
  }

  private generatePerUserCharts(stats: AggregatedStatsDto) {
    const dailyLabels = [...new Set(stats.perUserDailyOrders.map(d => this.toLabel(d.date)))];
    const monthLabels = [...new Set(
      stats.perUserMonthlyOrders.map(m =>
        new Date(m.year, m.month - 1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      )
    )];

    const groupByUser = (data: any[], labelFunc: (x: any) => string, valueFunc: (x: any) => number) => {
      const grouped: Record<string, { label: string; value: number }[]> = {};
      for (const x of data) {
        if (!grouped[x.username]) grouped[x.username] = [];
        grouped[x.username].push({ label: labelFunc(x), value: valueFunc(x) });
      }
      return grouped;
    };

    const toDatasets = (data: any[], labels: string[], labelFunc: (x: any) => string, valueFunc: (x: any) => number) => {
      const grouped = groupByUser(data, labelFunc, valueFunc);
      return Object.entries(grouped).map(([username, values]) => ({
        label: username,
        data: labels.map(l => values.find(v => v.label === l)?.value ?? 0),
        backgroundColor: this.randomColor(),
        borderColor: 'transparent',
        fill: true,
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 3,
      }));
    };

    this.perUserDailyOrdersChart = {
      labels: dailyLabels,
      datasets: toDatasets(stats.perUserDailyOrders, dailyLabels, x => this.toLabel(x.date), x => x.value)
    };

    this.perUserDailyRevenueChart = {
      labels: dailyLabels,
      datasets: toDatasets(stats.perUserDailyRevenue, dailyLabels, x => this.toLabel(x.date), x => x.value)
    };

    this.perUserMonthlyOrdersChart = {
      labels: monthLabels,
      datasets: toDatasets(stats.perUserMonthlyOrders, monthLabels,
        x => new Date(x.year, x.month - 1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        x => x.value)
    };

    this.perUserMonthlyRevenueChart = {
      labels: monthLabels,
      datasets: toDatasets(stats.perUserMonthlyRevenue, monthLabels,
        x => new Date(x.year, x.month - 1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        x => x.value)
    };
  }
}
