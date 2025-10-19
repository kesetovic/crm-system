namespace api.DTOs;

public class AggregatedStatsDto
{
    public List<DailyGlobalDto> GlobalDailyOrders { get; set; } = new();
    public List<DailyGlobalDto> GlobalDailyRevenue { get; set; } = new();
    public List<PerUserDailyDto> PerUserDailyOrders { get; set; } = new();
    public List<PerUserDailyDto> PerUserDailyRevenue { get; set; } = new();
    public List<PerUserMonthlyDto> PerUserMonthlyOrders { get; set; } = new();
    public List<PerUserMonthlyDto> PerUserMonthlyRevenue { get; set; } = new();
}
