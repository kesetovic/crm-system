using api.DTOs;
using api.Helpers;
using api.Interfaces;
using api.Model;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
namespace api.Data;

public class OrderRepository(DataContext context, IMapper mapper) : IOrderRepository
{
    public void AddOrder(Order order)
    {
        context.Orders.Add(order);
    }

    public void DeleteOrder(Order order)
    {
        context.Orders.Remove(order);
    }

    public Task<PagedList<OrderDto>> GetOrdersAsync(OrderParams orderParams)
    {
        var query = context.Orders.AsQueryable();

        if (orderParams.CustomerNameString != String.Empty && orderParams.CustomerNameString != null)
        {
            query = query.Where(x =>
                (x.CustomerName + " " + x.CustomerLastName).ToLower().Contains(orderParams.CustomerNameString.ToLower()));
        }

        query = query.Where(x => x.OrderPrice >= orderParams.minValue && x.OrderPrice <= orderParams.maxValue);

        query = orderParams.OrderBy switch
        {
            "oldest" => query.OrderBy(x => x.OrderDate),
            "lowest" => query.OrderBy(x => x.OrderPrice),
            "highest" => query.OrderByDescending(x => x.OrderPrice),
            _ => query.OrderByDescending(x => x.OrderDate)
        };

        return PagedList<OrderDto>.CreateAsync(query.ProjectTo<OrderDto>(mapper.ConfigurationProvider), orderParams.PageNumber, orderParams.PageSize);
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersForUserAsync(string username)
    {
        var orders = context.Orders
            .Where(o => o.AppUser.UserName == username)
            .ProjectTo<OrderDto>(mapper.ConfigurationProvider);

        return await orders.ToListAsync();
    }

    public async Task<PagedList<OrderDto>> GetOrdersForUserAsync(string username, OrderParams orderParams)
    {
        var query = context.Orders.AsQueryable();

        query = query.Where(o => o.AppUser.UserName == username);

        if (orderParams.CustomerNameString != String.Empty && orderParams.CustomerNameString != null)
        {
            query = query.Where(x =>
                (x.CustomerName + " " + x.CustomerLastName).ToLower().Contains(orderParams.CustomerNameString.ToLower()));
        }

        query = query.Where(x => x.OrderPrice >= orderParams.minValue && x.OrderPrice <= orderParams.maxValue);

        query = orderParams.OrderBy switch
        {
            "oldest" => query.OrderBy(x => x.OrderDate),
            "lowest" => query.OrderBy(x => x.OrderPrice),
            "highest" => query.OrderByDescending(x => x.OrderPrice),
            _ => query.OrderByDescending(x => x.OrderDate)
        };

        return await PagedList<OrderDto>.CreateAsync(query.ProjectTo<OrderDto>(mapper.ConfigurationProvider), orderParams.PageNumber, orderParams.PageSize);
    }
}
