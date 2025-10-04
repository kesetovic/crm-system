using api.Helpers;
using Microsoft.AspNetCore.Identity;
namespace api.Model;

public class AppUser : IdentityUser
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required Gender Gender { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Callee> Callees { get; set; } = new List<Callee>();
}
