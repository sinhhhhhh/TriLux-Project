using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BlogAPI.Models;
using BlogAPI.Data;
using BlogAPI.Helpers;

namespace BlogAPI.Controllers;

[Route("api/blogs")]
[ApiController]
public class BlogController : ControllerBase
{
    private readonly BlogDbContext _context;

    public BlogController(BlogDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBlogs()
    {
        var blogs = await _context.Blogs
        .Select(b => new
        {
            b.Id,
            b.Title,
            b.Slug,
            b.Category,
            b.Thumbnail,
            b.CreatedAt
        })
        .ToListAsync();

        if (!blogs.Any())
            return NotFound(new { message = "Không tìm thấy blog nào" });

        return Ok(blogs);
    }
    [HttpGet("with-content")]
    public async Task<IActionResult> GetBlogsWithContent()
    {
        var blogs = await _context.Blogs.ToListAsync();

        if (!blogs.Any())
            return NotFound(new { message = "Không tìm thấy blog nào" });

        return Ok(blogs);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBlog(string id)
    {
        var blog = await _context.Blogs.FindAsync(id);
        if (blog == null)
            return NotFound();

        return Ok(blog);
    }
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBlogBySlug(string slug)

    {
        var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Slug == slug);
        if (blog == null)
            return NotFound();

        return Ok(blog);
    }
    [HttpGet("showblog")]
    public async Task<IActionResult> GetBlogsWithShowblogSlug()
    {
        var blogs = await _context.Blogs
            .Where(b => b.Slug.EndsWith("showblog"))
            .Select(b => new
            {
                b.Id,
                b.Title,
                b.Slug,
                b.Category,
                b.Thumbnail,
                b.CreatedAt
            })
            .ToListAsync();

        if (!blogs.Any())
            return NotFound(new { message = "Không tìm thấy blog nào có slug kết thúc bằng 'showblog'" });

        return Ok(blogs);
    }
    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetBlogsByCategory(string category)
    {
        var blogs = await _context.Blogs
            .Where(b => b.Category == category)
            .Select(b => new
            {
                b.Id,
                b.Title,
                b.Slug,
                b.Category,
                b.Thumbnail,
                b.CreatedAt
            })
            .ToListAsync();

        if (!blogs.Any())
            return NotFound(new { message = "Không tìm thấy blog nào trong danh mục này" });

        return Ok(blogs);
    }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateBlog([FromBody] Blog blog)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        blog.Id = IdGenerator.GenerateId();
        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
    }
    [Authorize(Roles = "Admin")]

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBlog(string id, [FromBody] Blog updatedBlog)
    {
        Console.WriteLine($"🔄 Nhận yêu cầu cập nhật blog ID: {id}");
        var blog = await _context.Blogs.FindAsync(id);
        if (blog == null)
        {
            Console.WriteLine($"❌ Blog với ID {id} không tồn tại.");
            return NotFound(new { message = "Blog not found" });
        }

        blog.Title = updatedBlog.Title;
        blog.Slug = updatedBlog.Slug;
        blog.Content = updatedBlog.Content;
        blog.Category = updatedBlog.Category;
        blog.Thumbnail = updatedBlog.Thumbnail;

        try
        {
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ Blog ID {id} đã được cập nhật thành công.");
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Lỗi khi cập nhật blog ID {id}: {ex.Message}");
            return StatusCode(500, new { message = "Internal Server Error" });
        }
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBlog(string id)
    {
        var blog = await _context.Blogs.FindAsync(id);
        if (blog == null)
        {
            Console.WriteLine($"Blog with ID {id} not foundddddddddddddddddddddd");
            return NotFound(new { message = "Blog not found" });
        }
        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    [HttpPost("upload-thumbnail")]
    public async Task<IActionResult> UploadThumbnail(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File không hợp lệ");
        Console.WriteLine("Uploading thumbnail...");
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"{Request.Scheme}://{Request.Host}/images/{fileName}"; // URL ảnh
        return Ok(new { url = imageUrl });
    }
}