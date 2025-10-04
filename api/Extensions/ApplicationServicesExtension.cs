using System.Text.Json.Serialization;
using api.Data;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Extensions;

public static class ApplicationServicesExtension
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
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
            )
        );

        services.AddScoped<IJwtTokenService, TokenService>();

        return services;
    }
}
