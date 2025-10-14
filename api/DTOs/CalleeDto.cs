namespace api.DTOs;

public class CalleeDto
{
    public required string CalleeId {get;set;}
    public required string PhoneNumber { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Address { get; set; }
    public required string Email { get; set; }
}
