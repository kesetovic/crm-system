using api.DTOs;
using api.Interfaces;
using api.Model;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class CalleeRepository(DataContext context, IMapper mapper) : ICalleeRepository
{
    public void AddCallee(Callee callee)
    {
        context.Callees.Add(callee);
    }

    public void DeleteCallee(Callee callee)
    {
        context.Callees.Remove(callee);
    }

    public async Task<Callee?> GetCalleeByIdAsync(string id)
    {
        return await context.Callees.FindAsync(id);
    }

    public async Task<IEnumerable<CalleeDto>> GetCalleesForUserAsync(string username)
    {
        var query = context.Callees.Include(x => x.AppUser)
            .Where(x => x.AppUser.UserName == username);
        return await query.ProjectTo<CalleeDto>(mapper.ConfigurationProvider).ToListAsync();
    }
}
