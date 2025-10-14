using api.DTOs;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Model;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController(IUnitOfWork unitOfWork, IMapper mapper) : BaseController
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
                return Ok(mapper.Map<OrderDto>(newOrder));
            }

            return BadRequest("Failed to create order");
        }
    }

}
