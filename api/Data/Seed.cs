using System.Text.Json;
using System.Text.Json.Serialization;
using api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        if (userManager.Users.Any()) return;

        var roles = new[] { "Operater", "Packer", "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole { Name = role });
            }
        }

        var json = await System.IO.File.ReadAllTextAsync("Data/SeedData.json");
        var options = new JsonSerializerOptions
        {
            Converters =
            {
                new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
            },
            PropertyNameCaseInsensitive = true
        };

        var users = JsonSerializer.Deserialize<List<AppUser>>(json, options);
        if (users == null) return;

        foreach (var user in users)
        {
            user.EmailConfirmed = true;
            var result = await userManager.CreateAsync(user, "password1");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Operater");
            }
        }

        var admin = new AppUser
        {
            UserName = "admin",
            FirstName = "System",
            LastName = "Admin",
            Email = "admin@example.com",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = Helpers.Gender.MALE,
            EmailConfirmed = true
        };

        if (await userManager.FindByNameAsync(admin.UserName) == null)
        {
            var result = await userManager.CreateAsync(admin, "password1");
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(admin, roles);
            }
        }
    }
}
