using api.DTOs;
using api.Helpers;
using api.Model;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace api.Interfaces;

public interface IOrderRepository
{
    void AddOrder(Order order);
    void DeleteOrder(Order order);
    Task<IEnumerable<OrderDto>> GetOrdersForUserAsync(string username);
    Task<PagedList<OrderDto>> GetOrdersForUserAsync(string username, OrderParams orderParams);
    Task<PagedList<OrderDto>> GetOrdersAsync(OrderParams orderParams);
    
}
