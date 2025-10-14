using api.Helpers;

namespace api.DTOs;

public class AddOrderDto
{
    public required string CustomerName { get; set; }
    public required string CustomerLastName { get; set; }
    public required string CustomerAddress { get; set; }
    public required string CustomerPhone { get; set; }
    public required string Product { get; set; }
    public required double OrderPrice { get; set; }
    public string OrderNotes { get; set; } = string.Empty;
}
