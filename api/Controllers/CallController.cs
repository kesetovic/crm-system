using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;


public class CallController(IUnitOfWork unitOfWork, ITwilioService twilioService) : BaseController
{

    [Authorize]
    [HttpGet("token")]
    public ActionResult GetToken([FromQuery] string identity)
    {
        var token = twilioService.GenerateTwilioToken(identity);
        return Ok(new { token });
    }
    [HttpPost("voice")]
    public async Task<IActionResult> HandleVoice([FromForm] string To, [FromForm] string From)
    {
        var response = new Twilio.TwiML.VoiceResponse();

        var agentIdentity = From?.Replace("client:", "");
        var user = await unitOfWork.Users.GetUserByIdAsync(agentIdentity!);

        if (user == null || string.IsNullOrWhiteSpace(user.TwillioNumber))
        {
            response.Say("Invalid user or missing Twillio number");
            return Content(response.ToString(), "text/xml");
        }

        if (!string.IsNullOrEmpty(To))
        {
            var dial = new Twilio.TwiML.Voice.Dial(callerId: user.TwillioNumber);
            dial.Number(To);
            response.Append(dial);
        }
        else
        {
            response.Say("No destination number provided.");
        }
        
        return Content(response.ToString(), "text/xml");
    }
}

