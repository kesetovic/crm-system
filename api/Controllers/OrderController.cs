using api.DTOs;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Model;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace api.Controllers;

public class OrderController(IUnitOfWork unitOfWork, IMapper mapper, IHubContext hubContext) : BaseController
{
    [HttpGet("fetch")]
    [Authorize]
    public async Task<ActionResult> GetOrdersForUser([FromQuery] OrderParams orderParams)
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        var orders = await unitOfWork.Orders.GetOrdersForUserAsync(username, orderParams);
        Response.AddPaginationHeader(orders);

        return Ok(orders);
    }
    [HttpGet("fetch/all")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders([FromQuery] OrderParams orderParams)
    {
        var orders = await unitOfWork.Orders.GetOrdersAsync(orderParams);
        Response.AddPaginationHeader(orders);
        return Ok(orders);
    }
    [HttpPost("add")]
    [Authorize(Roles = "Operater, Admin")]
    public async Task<ActionResult<OrderDto>> AddOrder([FromBody] AddOrderDto orderDto)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username)) return Unauthorized();

        var newOrder = new Order
        {
            OrderId = Guid.NewGuid().ToString(),
            CustomerName = orderDto.CustomerName,
            CustomerLastName = orderDto.CustomerLastName,
            CustomerPhone = orderDto.CustomerPhone,
            CustomerAddress = orderDto.CustomerAddress,
            Product = orderDto.Product,
            OrderPrice = orderDto.OrderPrice,
            OrderNotes = orderDto.OrderNotes,
            OrderDate = DateTime.UtcNow,
            OrderStatus = OrderStatus.NEW,
            BonusAwarded = orderDto.OrderPrice * 0.05,
            AppUserId = (await unitOfWork.Users.GetUserByUsernameAsync(username))?.Id!,
        };

        unitOfWork.Orders.AddOrder(newOrder);

        if (await unitOfWork.CompleteAsync())
        {
            await hubContext.Clients.All.SendAsync("OrderSignal");
            return Ok(mapper.Map<OrderDto>(newOrder));
        }

        return BadRequest("Failed to create order");
    }
    [HttpPut("{orderId}/pack")]
    [Authorize(Roles = "Packer, Admin")]
    public async Task<ActionResult> PackOrder(string orderId)
    {
        var order = await unitOfWork.Orders.GetOrderByIdAsync(orderId);
        if (order == null) return NotFound("Order doesn't exist");
        if (order.OrderStatus != OrderStatus.NEW) return BadRequest("Order cannot be packed");

        order.OrderStatus = OrderStatus.PACKED;
        unitOfWork.Orders.UpdateOrder(order);

        if (await unitOfWork.CompleteAsync())
        {
            await hubContext.Clients.All.SendAsync("OrderSignal");
            return Ok();
        }

        return BadRequest();
    }

    [HttpPut("{orderId}/complete")]
    [Authorize(Roles = "Packer, Admin")]
    public async Task<ActionResult> CompleteOrder(string orderId)
    {
        var order = await unitOfWork.Orders.GetOrderByIdAsync(orderId);
        if (order == null) return NotFound("Order doesn't exist");
        if (order.OrderStatus != OrderStatus.PACKED) return BadRequest("Order cannot be completed");

        order.OrderStatus = OrderStatus.COMPLETED;
        unitOfWork.Orders.UpdateOrder(order);

        if (await unitOfWork.CompleteAsync())
        {
            await hubContext.Clients.All.SendAsync("OrderSignal");
            return Ok();
        }

        return BadRequest();
    }

    [HttpPut("{orderId}/cancel")]
    [Authorize(Roles = "Packer, Admin")]
    public async Task<ActionResult> CancelOrder(string orderId)
    {
        var order = await unitOfWork.Orders.GetOrderByIdAsync(orderId);

        if (order == null) return NotFound("Order doesn't exist");
        if (order.OrderStatus != OrderStatus.NEW &&
         order.OrderStatus != OrderStatus.PACKED)
        {
            return BadRequest("Order cannot be cancelled");
        }

        order.OrderStatus = OrderStatus.CANCELLED;
        unitOfWork.Orders.UpdateOrder(order);

        if (await unitOfWork.CompleteAsync())
        {
            await hubContext.Clients.All.SendAsync("OrderSignal");
            return Ok();
        }

        return BadRequest();
    }
    [Authorize(Roles = "Packer,Admin")]
    [HttpGet("fetch/topack")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersToPack([FromQuery] OrderParams orderParams)
    {
        var orders = await unitOfWork.Orders.GetOrdersToPackAsync(orderParams);
        Response.AddPaginationHeader(orders);
        return Ok(orders);
    }
    [HttpDelete("{orderId}/remove")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> RemoveOrder(string orderId)
    {
        var order = await unitOfWork.Orders.GetOrderByIdAsync(orderId);
        if (order == null) return BadRequest("Order with given ID doesn't exist.");

        unitOfWork.Orders.DeleteOrder(order);
        if (await unitOfWork.CompleteAsync())
        {
            await hubContext.Clients.All.SendAsync("OrderSignal");
            return Ok();
        }
        return BadRequest("Something went wrong while removing order.");
    }
}


