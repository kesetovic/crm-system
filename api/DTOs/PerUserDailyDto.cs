namespace api.DTOs;

public class PerUserDailyDto
{
    public string Username { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public double Value { get; set; } // either revenue or count
}