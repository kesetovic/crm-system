using api.Data;
using api.DTOs;
using api.Helpers;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

public class StatsService(DataContext context) : IStatsService
{
    public async Task<AggregatedStatsDto> GetAggregatedStats()
    {
        var now = DateTime.UtcNow.Date;
        var startDate = now.AddDays(-6);
        var startMonth = new DateTime(now.Year, now.Month, 1).AddMonths(-11);

        var globalDailyOrders = await context.Orders
            .Where(o => o.OrderDate.Date >= startDate)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new DailyGlobalDto
            {
                Date = g.Key,
                Value = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        var globalDailyRevenue = await context.Orders
            .Where(o => o.OrderDate.Date >= startDate)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new DailyGlobalDto
            {
                Date = g.Key,
                Value = g.Sum(o => o.OrderPrice)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        var perUserDailyOrders = await context.Orders
            .Where(o => o.OrderDate.Date >= startDate)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => new { o.AppUser.UserName, o.OrderDate.Date })
            .Select(g => new PerUserDailyDto
            {
                Username = g.Key.UserName!,
                Date = g.Key.Date,
                Value = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        var perUserDailyRevenue = await context.Orders
            .Where(o => o.OrderDate.Date >= startDate)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => new { o.AppUser.UserName, o.OrderDate.Date })
            .Select(g => new PerUserDailyDto
            {
                Username = g.Key.UserName!,
                Date = g.Key.Date,
                Value = g.Sum(o => o.OrderPrice)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        var perUserMonthlyOrders = await context.Orders
            .Where(o => o.OrderDate >= startMonth)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => new { o.AppUser.UserName, o.OrderDate.Year, o.OrderDate.Month })
            .Select(g => new PerUserMonthlyDto
            {
                Username = g.Key.UserName!,
                Year = g.Key.Year,
                Month = g.Key.Month,
                Value = g.Count()
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToListAsync();

        var perUserMonthlyRevenue = await context.Orders
            .Where(o => o.OrderDate >= startMonth)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => new { o.AppUser.UserName, o.OrderDate.Year, o.OrderDate.Month })
            .Select(g => new PerUserMonthlyDto
            {
                Username = g.Key.UserName!,
                Year = g.Key.Year,
                Month = g.Key.Month,
                Value = g.Sum(o => o.OrderPrice)
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToListAsync();

        return new AggregatedStatsDto
        {
            GlobalDailyOrders = globalDailyOrders,
            GlobalDailyRevenue = globalDailyRevenue,
            PerUserDailyOrders = perUserDailyOrders,
            PerUserDailyRevenue = perUserDailyRevenue,
            PerUserMonthlyOrders = perUserMonthlyOrders,
            PerUserMonthlyRevenue = perUserMonthlyRevenue
        };
    }


    public async Task<OrderSummaryDto> GetUserStats(string username)
    {
        var now = DateTime.UtcNow.Date;
        var startDate = now.AddDays(-6);

        var userOrders = context.Orders.Where(o => o.AppUser.UserName == username);

        var totalSales = await userOrders.CountAsync();
        var totalRevenue = await userOrders.SumAsync(o => o.OrderPrice);
        var totalBonus = await userOrders.SumAsync(o => o.BonusAwarded);

        var dailySales = await userOrders
            .Where(o => o.OrderDate.Date >= startDate)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new DailySalesDto
            {
                Date = g.Key.Date,
                Count = g.Count(),
                TotalRevenue = g.Sum(o => o.OrderPrice),
                TotalBonus = g.Sum(o => o.BonusAwarded)
            })
            .OrderBy(g => g.Date)
            .ToListAsync();


        var averageDailySales = await context.Orders
            .Where(o => o.OrderDate.Date >= startDate)
            .Where(o => o.AppUser.UserName != username)
            .Where(o => o.OrderStatus.Equals(OrderStatus.COMPLETED))
            .GroupBy(o => new { o.AppUserId, Date = o.OrderDate.Date })
            .Select(g => new
            {
                Date = g.Key.Date,
                TotalOrders = g.Count(),
                TotalRevenue = g.Sum(o => o.OrderPrice),
                TotalBonus = g.Sum(o => o.BonusAwarded)
            })
            .GroupBy(x => x.Date)
            .Select(g => new DailySalesDto
            {
                Date = g.Key.Date,
                Count = (int)Math.Round(g.Average(x => x.TotalOrders)),
                TotalRevenue = g.Average(x => x.TotalRevenue),
                TotalBonus = g.Average(x => x.TotalBonus)
            })
            .OrderBy(g => g.Date)
            .ToListAsync();

        return new OrderSummaryDto
        {
            TotalSales = totalSales,
            TotalRevenue = totalRevenue,
            TotalBonus = totalBonus,
            DailySales = dailySales,
            AverageDailySales = averageDailySales
        };
    }

}
