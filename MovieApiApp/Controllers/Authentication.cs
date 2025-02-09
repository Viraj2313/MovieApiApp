using Microsoft.AspNetCore.Mvc;
using WbApp.Data;
using System.Net.Http;
using System.Threading.Tasks;
using Form.Models;
using Microsoft.EntityFrameworkCore;
using WbApp.Dto;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;
namespace WbApp.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        public readonly MainDbContext _context;
        private readonly TokenService _tokenService;
        public readonly HttpClient _httpClient;
        public AuthenticationController(MainDbContext context, HttpClient client,TokenService tokenService)
        {
            _tokenService= tokenService;
            _context = context;
            _httpClient = client;
        }

        //for sign up/register
        [HttpPost("register")]
        public async Task<IActionResult> SignUp([FromBody] User user)
        {
            user.Password =BCrypt.Net.BCrypt.HashPassword(user.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            //HttpContext.Session.SetString("User Id", user.Id.ToString());
            var token=_tokenService.GenerateToken(user);
             Response.Cookies.Append("jwt", token, new CookieOptions
             {
                 HttpOnly = true,
                 Secure = true,
                 SameSite = SameSiteMode.Strict,
                 Expires = DateTime.UtcNow.AddHours(2)
             });
            return Ok(new { message = "User registered successfully" , userId=user.Id});
        }

        [HttpGet("check-session")]
        public IActionResult CheckSession()
        {
            var token = Request.Cookies["Jwt"];

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Jwt token missing");
            }

            var principal = _tokenService.ValidateJwtToken(token);
            if (principal == null)
            {
                return Unauthorized(new { message = "Invalid or expired token." });

            }
            var userIdClaim = principal.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "Invalid token." });
            }
            return Ok(new { message = "Session active", userId = userIdClaim });
        }

        //for login
        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] LoginReq loginReq)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginReq.Email);
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(loginReq.Password,existingUser.Password))
            {
                return Unauthorized(new { message = "Invalid email or password" });


            }
            //HttpContext.Session.SetString("User Id", existingUser.Id.ToString());
            //HttpContext.Session.SetString("User Name", existingUser.Name.ToString());
            var token =_tokenService.GenerateToken(existingUser);
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,  // Prevents client-side JavaScript access (XSS protection)
                Secure = true,     // Ensures the cookie is sent over HTTPS
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(2) // Token expiry
            });
            return Ok(new { message = "login success",userId = existingUser.Id, userName= existingUser.Name });
        }
        [HttpPost("logout")]
        public IActionResult logout()
        {
            //HttpContext.Session.Clear();
            Response.Cookies.Delete("jwt");
            return Ok( new { message = "Logged out successfully" } );
        }
        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var token = Request.Cookies["jwt"]; 

            if (string.IsNullOrEmpty(token))
            {
                Debug.WriteLine("Token is null");
                return Unauthorized();
            }

            var claims = _tokenService.ValidateJwtToken(token);
            if (claims == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(claims.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(new { userName = user.Name });
        }
    }
}
