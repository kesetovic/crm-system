using api.Interfaces;
using api.Model;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class AppUserRepository(DataContext context) : IAppUserRepository
{
    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users.FirstOrDefaultAsync(x => x.UserName == username);
    }
    public async Task<AppUser?> GetUserByIdAsync(string id)
    {
        return await context.Users.FirstOrDefaultAsync(x => x.Id == id);
    }
}
