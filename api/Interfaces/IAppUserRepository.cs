using api.Model;

namespace api.Interfaces;

public interface IAppUserRepository
{
    public Task<AppUser?> GetUserByUsernameAsync(string username);
}
