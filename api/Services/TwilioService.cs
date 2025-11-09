using api.Interfaces;
using Twilio;
using Twilio.Jwt.AccessToken;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace api.Services;

public class TwilioService : ITwilioService
{
    private readonly IConfiguration config;
    private readonly string _sid;
    private readonly string _token;
    private readonly string _apiKey;
    private readonly string _apiSecret;
    private readonly string _appSid;

    public TwilioService(IConfiguration config)
    {
        this.config = config;
        _sid = config["Twilio:AccountSid"]!;
        _token = config["Twilio:AuthToken"]!;
        _apiKey = config["Twilio:ApiKey"]!;
        _apiSecret = config["Twilio:ApiSecret"]!;
        _appSid = config["Twilio:TwimlAppSid"]!;
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
    public string GenerateTwilioToken(string identity)
    {
        var grant = new VoiceGrant
        {
            OutgoingApplicationSid = _appSid,
            IncomingAllow = false
        };

        var grants = new HashSet<IGrant> { grant };

        var token = new Token(
            _sid,
            _apiKey,
            _apiSecret,
            identity: identity,
            grants: grants
        );

        return token.ToJwt();
    }

}
