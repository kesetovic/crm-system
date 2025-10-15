using System.Text.Json.Serialization;
using api.Helpers;

namespace api.DTOs;

public class OrderDto
{
    public required string OrderId { get; set; }
    public required string CustomerName { get; set; }
    public required string CustomerLastName { get; set; }
    public required string CustomerAddress { get; set; }
    public required string CustomerPhone { get; set; }
    public required string Product { get; set; }
    public required double OrderPrice { get; set; }
    public required DateTime OrderDate { get; set; }
    public string OrderNotes { get; set; } = string.Empty;
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required OrderStatus OrderStatus { get; set; }
    public double BonusAwarded { get; set; } = 0;
}
