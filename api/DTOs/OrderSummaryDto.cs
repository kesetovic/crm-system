using System;

namespace api.DTOs;

public class OrderSummaryDto
{
    public int TotalSales { get; set; }
    public double TotalRevenue { get; set; }
    public double TotalBonus { get; set; }
    public List<DailySalesDto> DailySales { get; set; } = new();
    public List<DailySalesDto> AverageDailySales { get; set; } = new();
}
