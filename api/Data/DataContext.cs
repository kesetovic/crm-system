using System;
using api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<AppUser, IdentityRole, string>(options)
{
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<Callee> Callees { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Order>()
        .HasOne(o => o.AppUser)
        .WithMany(u => u.Orders)
        .HasForeignKey(o => o.AppUserId)
        .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Callee>()
        .HasOne(c => c.AppUser)
        .WithMany(u => u.Callees)
        .HasForeignKey(c => c.AppUserId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}
