import { DailySalesDto } from "./dailySalesDto";

export interface OrderSummaryDto {
    totalSales: number,
    totalRevenue: number,
    totalBonus: number,
    dailySales: DailySalesDto[],
    averageDailySales: DailySalesDto[]
}