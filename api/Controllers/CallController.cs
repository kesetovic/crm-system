using api.Data;
using api.DTOs;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;


public class CallController(IUnitOfWork unitOfWork, ITwilioService twilioService) : BaseController
{
    [HttpPost("call-contact")]
    [Authorize]
    public async Task<ActionResult> CallContact([FromBody] CallContactDto dto)
    {
        var user = await unitOfWork.Users.GetUserByIdAsync(dto.AppUserId);
        var contact = await unitOfWork.Callees.GetCalleeByIdAsync(dto.ContactId);

        if (user == null || contact == null)
            return NotFound("User or contact not found.");

        if (string.IsNullOrWhiteSpace(user.TwillioNumber))
            return BadRequest("User has no Twilio number assigned.");

        var bridgeUrl = $"https://two-hoops-doubt.loca.lt/api/twilio/bridge?to={Uri.EscapeDataString(contact.PhoneNumber!)}";

        var call = twilioService.ConnectUserToContact(user.TwillioNumber, contact.PhoneNumber, bridgeUrl);

        return Ok(new { sid = call.Sid, status = call.Status.ToString() });
    }

    [HttpPost("bridge")]
    public ContentResult Bridge([FromQuery] string to)
    {
        var response = new Twilio.TwiML.VoiceResponse();
        response.Dial(to);
        return Content(response.ToString(), "text/xml");
    }
}

