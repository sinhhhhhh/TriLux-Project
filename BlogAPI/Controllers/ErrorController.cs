using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;


namespace BlogAPI.Controllers;
[ApiController]
[Route("error")]
public class ErrorController : ControllerBase
{
    [HttpGet]
    public IActionResult HandleError()

    {
        var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
        var error = context?.Error;

        var response = new
        {
            Message = "Đã xảy ra lỗi trong hệ thống.",
            Detail = error?.Message
        };

        return Problem(detail: response.Detail, title: response.Message);
    }
}
