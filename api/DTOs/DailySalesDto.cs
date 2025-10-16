using System;

namespace api.DTOs;

public class DailySalesDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
    public double TotalRevenue { get; set; }
    public double TotalBonus { get; set; }
}
