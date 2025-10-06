using api.Interfaces;
using AutoMapper;

namespace api.Data;

public class AppUserRepository(DataContext context, IMapper mapper) : IAppUserRepository
{

}
