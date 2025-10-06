using api.Interfaces;

namespace api.Data;

public class UnitOfWork(DataContext context, IOrderRepository orderRepository, IAppUserRepository appUserRepository, ICalleeRepository calleeRepository) : IUnitOfWork
{
    public IAppUserRepository Users => appUserRepository;
    public ICalleeRepository Callees => calleeRepository;
    public IOrderRepository Orders => orderRepository;

    public async Task<bool> CompleteAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
