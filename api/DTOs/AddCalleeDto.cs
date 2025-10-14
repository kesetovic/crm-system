namespace api.DTOs;

public class AddCalleeDto
{
    public required string PhoneNumber { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Address { get; set; }
    public required string Email { get; set; }
}