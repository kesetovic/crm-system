using api.DTOs;
using api.Model;

namespace api.Interfaces;

public interface ICalleeRepository
{
    public void AddCallee(Callee callee);
    public void DeleteCallee(Callee callee);
    public Task<Callee?> GetCalleeByIdAsync(string id);
    public Task<IEnumerable<CalleeDto>> GetCalleesForUserAsync(string username);
}
