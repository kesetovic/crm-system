using api.Interfaces;
using AutoMapper;

namespace api.Data;

public class CalleeRepository(DataContext context, IMapper mapper) : ICalleeRepository
{

}
