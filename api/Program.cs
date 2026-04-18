using api.Data;
using api.Extensions;
using api.Hubs;
using api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager, roleManager, builder.Configuration);
}

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins(builder.Configuration["AllowedOrigins"]?.Split(",") ?? ["http://localhost:4200"]).AllowCredentials());

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<OrderHub>("/api/ordersHub");

app.Run("http://0.0.0.0:80");