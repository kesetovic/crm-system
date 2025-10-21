using System.Text.Json.Serialization;
using api.Data;
using api.Helpers;
using api.Interfaces;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Extensions;

public static class ApplicationServicesExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddSignalR();
        services
        .AddControllers()
        .AddJsonOptions(
            options =>
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
        );

        services
        .AddDbContext<DataContext>(options =>
            options
            .UseSqlite(config.GetConnectionString("DefaultConnection"))
        );

        services
        .AddCors(
            options => options.AddDefaultPolicy(
                policy => policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .WithOrigins("http://localhost:4200", "https://localhost:4200")
                .AllowCredentials()
            )
        );

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IStatsService, StatsService>();
        services.AddSingleton<ITwilioService, TwilioService>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<ICalleeRepository, CalleeRepository>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

        return services;
    }
}
