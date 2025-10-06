using api.DTOs;
using api.Model;
using AutoMapper;

namespace api.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, AppUserDto>();
        CreateMap<Order, OrderDto>();
        CreateMap<Callee, CalleeDto>();
    }
}
