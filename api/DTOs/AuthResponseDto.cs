namespace api.DTOs;

public class AuthResponseDto
{
    public required string Token { get; set; }
    public required DateTime Expiration { get; set; }
    public required string Username { get; set; }
    public IEnumerable<string>? Roles { get; set; }
    public required string UserId { get; set; }
}
