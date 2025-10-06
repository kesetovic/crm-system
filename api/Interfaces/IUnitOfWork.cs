namespace api.Interfaces;

public interface IUnitOfWork
{
    IAppUserRepository Users { get; }
    ICalleeRepository Callees { get; }
    IOrderRepository Orders { get; }

    Task<bool> CompleteAsync();
    bool HasChanges();
}
