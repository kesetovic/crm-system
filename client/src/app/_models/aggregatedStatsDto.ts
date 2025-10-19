import { DailyGlobalDto } from "./dailyGlobalDto";
import { PerUserDailyDto } from "./perUserDailyDto";
import { PerUserMonthlyDto } from "./perUserMonthlyDto";

export interface AggregatedStatsDto {
    globalDailyOrders: DailyGlobalDto[],
    globalDailyRevenue: DailyGlobalDto[],
    perUserDailyOrders: PerUserDailyDto[],
    perUserDailyRevenue: PerUserDailyDto[],
    perUserMonthlyOrders: PerUserMonthlyDto[],
    perUserMonthlyRevenue: PerUserMonthlyDto[]
}