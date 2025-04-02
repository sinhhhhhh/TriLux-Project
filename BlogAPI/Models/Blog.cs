using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Models;

public class Blog
{
    [Key]
    [StringLength(6, MinimumLength = 6)]
    public required string Id { get; set; }

    [Required]
    public required string Title { get; set; }

    [Required]
    public required string Slug { get; set; }

    [Required]
    public required string Content { get; set; }

    public string? Thumbnail { get; set; }
    public string? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
