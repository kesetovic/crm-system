using api.Controllers;
using api.DTOs;
using api.Interfaces;
using api.Model;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

public class ContactsController(IUnitOfWork unitOfWork, IMapper mapper) : BaseController
{
    [Authorize]
    [HttpGet("fetch")]
    public async Task<ActionResult<IEnumerable<CalleeDto>>> GetContactsForUser()
    {
        var username = User.Identity?.Name;

        if (String.IsNullOrEmpty(username)) return Unauthorized();

        var contacts = await unitOfWork.Callees.GetCalleesForUserAsync(username);

        return Ok(contacts);
    }
    [Authorize]
    [HttpPost("add")]
    public async Task<ActionResult<CalleeDto>> AddContact([FromBody] AddCalleeDto calleeDto)
    {
        var username = User.Identity?.Name;

        if (String.IsNullOrEmpty(username)) return Unauthorized();

        AppUser? user = await unitOfWork.Users.GetUserByUsernameAsync(username);
        if (user == null)
        {
            return Unauthorized();
        }

        var callee = new Callee
        {
            CalleeId = Guid.NewGuid().ToString(),
            FirstName = calleeDto.FirstName,
            LastName = calleeDto.LastName,
            PhoneNumber = calleeDto.PhoneNumber,
            Email = calleeDto.Email,
            Address = calleeDto.Address,
            AppUserId = user.Id,
        };

        unitOfWork.Callees.AddCallee(callee);

        if (await unitOfWork.CompleteAsync())
        {
            return Ok(mapper.Map<CalleeDto>(callee));
        }


        return BadRequest("Failed to add contact");

    }
    [Authorize]
    [HttpDelete("delete/{calleeId}")]
    public async Task<ActionResult> DeleteContact(string calleeId)
    {
        var username = User.Identity?.Name;

        if (String.IsNullOrEmpty(username)) return Unauthorized();

        var user = await unitOfWork.Users.GetUserByUsernameAsync(username);
        if (user == null) return Unauthorized();

        var callee = await unitOfWork.Callees.GetCalleeByIdAsync(calleeId);

        if (callee == null) return NotFound("There is no contact with given id");
        if (callee.AppUserId != user.Id) return Unauthorized();

        unitOfWork.Callees.DeleteCallee(callee);

        if (await unitOfWork.CompleteAsync())
        {
            return NoContent();
        }

        return BadRequest("Failed to delete contact");
    }
}