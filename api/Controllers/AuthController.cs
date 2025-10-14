using api.DTOs;
using api.Interfaces;
using api.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

public class AuthController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseController
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        AppUser? user = await userManager.FindByNameAsync(loginDto.Username.ToLower());
        if (user == null)
        {
            return Unauthorized("Invalid username");
        }

        bool isPasswordValid = await userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!isPasswordValid)
        {
            return Unauthorized("Invalid password");
        }

        IList<string> roles = await userManager.GetRolesAsync(user);

        var (token, expiration) = await tokenService.CreateTokenAsync(user, roles);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Expiration = expiration,
            Username = user.UserName!,
            Roles = roles,
            UserId = user.Id
        });
    }
}

