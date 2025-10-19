using api.DTOs;

namespace api.Interfaces;

public interface IStatsService
{
    public Task<OrderSummaryDto> GetUserStats(string username);
    public Task<AggregatedStatsDto> GetAggregatedStats();
}
