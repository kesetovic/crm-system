using api.Model;

namespace api.Interfaces;

public interface ITokenService
{
    Task<(string token, DateTime expiration)> CreateTokenAsync(AppUser user, IList<string> roles);
}
