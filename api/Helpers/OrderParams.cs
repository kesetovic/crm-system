namespace api.Helpers;

public class OrderParams : PaginationParams
{
    public string? CustomerNameString { get; set; }
    public double minValue { get; set; }
    public double maxValue { get; set; }
    public string OrderBy { get; set; } = "lastAdded";
}