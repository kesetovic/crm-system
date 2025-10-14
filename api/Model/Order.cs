using api.Helpers;
namespace api.Model;

public class Order
{
    public required string OrderId { get; set; } = Guid.NewGuid().ToString();
    public required string CustomerName { get; set; }
    public required string CustomerLastName { get; set; }
    public required string CustomerAddress { get; set; }
    public required string CustomerPhone { get; set; }
    public required string Product { get; set; }
    public required double OrderPrice { get; set; }
    public required DateTime OrderDate { get; set; }
    public string OrderNotes { get; set; } = string.Empty;
    public required OrderStatus OrderStatus { get; set; } = OrderStatus.NEW;
    public double BonusAwarded { get; set; } = 0;

    public string AppUserId { get; set; } = string.Empty;
    public AppUser AppUser { get; set; } = null!;
}
