using api.Interfaces;
using AutoMapper;
namespace api.Data;

public class OrderRepository(DataContext context, IMapper mapper) : IOrderRepository
{

}
