namespace api.DTOs;

public class PerUserMonthlyDto
{
    public string Username { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Month { get; set; }
    public double Value { get; set; }
}