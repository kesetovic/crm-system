namespace api.Model;

public class Callee
{
    public required string CalleeId { get; set; } = Guid.NewGuid().ToString();
    public required string PhoneNumber { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Address { get; set; }
    public required string Email { get; set; }


    public string AppUserId { get; set; } = string.Empty;
    public AppUser AppUser { get; set; } = null!;
}
