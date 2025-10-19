using api.DTOs;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

public class StatsController(IUnitOfWork unitOfWork) : BaseController
{
    [Authorize]
    [HttpGet("fetch")]
    public async Task<ActionResult<OrderSummaryDto>> GetSummaryForUser()
    {
        var username = User.Identity?.Name;

        if (String.IsNullOrEmpty(username)) return Unauthorized();

        var stats = await unitOfWork.Stats.GetUserStats(username);
        return Ok(stats);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("fetch/aggregate")]
    public async Task<ActionResult<AggregatedStatsDto>> GetAggregatedStats()
    {
        var result = await unitOfWork.Stats.GetAggregatedStats();
        return Ok(result);
    }
}
