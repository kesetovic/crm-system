using api.Interfaces;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace api.Services;

public class TwilioService : ITwilioService
{
    private readonly string _sid;
    private readonly string _token;
    public TwilioService(IConfiguration config)
    {
        _sid = config["Twilio:AccountSid"]!;
        _token = config["Twilio:AuthToken"]!;
        TwilioClient.Init(_sid, _token);
    }
    public CallResource ConnectUserToContact(string fromNumber, string toNumber, string bridgeUrl)
    {
        var call = CallResource.Create(
            from: new PhoneNumber(fromNumber),
            to: new PhoneNumber(toNumber),
            url: new Uri(bridgeUrl)
        );
        return call;
    }
}
