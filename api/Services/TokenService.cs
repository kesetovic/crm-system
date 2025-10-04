
using System.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using api.Model;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace api.Services;

public class JwtOptions
{
    public string Key { get; set; } = String.Empty;
    public string Issuer { get; set; } = String.Empty;
    public string Audience { get; set; } = String.Empty;
    public double DurationInMinutes { get; set; } = 60;
}

public interface IJwtTokenService
{
    Task<(string token, DateTime expiration)> CreateTokenAsync(AppUser user, IList<string> roles);
}

public class TokenService : IJwtTokenService
{
    private readonly JwtOptions _jwtOptions;

    public TokenService(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }

    public Task<(string token, DateTime expiration)> CreateTokenAsync(AppUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new (JwtRegisteredClaimNames.Sub, user.Id),
            new (JwtRegisteredClaimNames.UniqueName, user.UserName ?? ""),
            new (ClaimTypes.NameIdentifier, user.Id),
            new (ClaimTypes.Name, user.UserName ?? ""),
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtOptions.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiration = DateTime.UtcNow.AddMinutes(_jwtOptions.DurationInMinutes);

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiration,
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return Task.FromResult((jwt, expiration));
    }
}

