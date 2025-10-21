using Twilio.Rest.Api.V2010.Account;

namespace api.Interfaces;

public interface ITwilioService
{
    public CallResource ConnectUserToContact(string fromNumber, string toNumber, string bridgeUrl);
}
