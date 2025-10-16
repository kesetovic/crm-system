using api.DTOs;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class StatsService(DataContext context) : IStatsService
{
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
