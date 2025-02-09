
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using WbApp.Data;
using WbApp.Dto;
using WbApp.Models;

namespace WbApp.Controllers
{
    [Route("api")]
    [ApiController]
    public class WishListController : ControllerBase
    {
        private readonly MainDbContext _context;

        public WishListController(MainDbContext context)
        {
            _context = context;
        }
        [HttpPost("add_wishlist")]
        public async Task<IActionResult> AddToWishlist([FromBody] WishList wishlist)
        {

            var userIdStr = HttpContext.Session.GetString("User Id");
            if (userIdStr == null)
            {
                Debug.WriteLine("Session is null or 'User Id' is not set.");
            }
            if (string.IsNullOrEmpty(userIdStr))
            {
                Debug.WriteLine("User Id not set in session.");
            }
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized("User not logged in or invalid UserId.");
            }

            if (string.IsNullOrEmpty(wishlist.MovieId))
            {
                return BadRequest("MovieId cannot be null or empty.");
            }

            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
            return Ok(new { message = "movie added to wishlist" });
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromWishlist([FromBody] MovieDel movieDel)
        {
            var userIdStr = HttpContext.Session.GetString("User Id");
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }
            if (movieDel.MovieId == null)
            {
                return BadRequest("MovieId cannot be null or empty.");
            }
            var wishlistItem = await _context.Wishlists.FirstOrDefaultAsync(w=>w.MovieId == movieDel.MovieId && w.UserId == userId);

            if (wishlistItem == null)
            {
                return NotFound("Movie not found in wishlist.");
            }
            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();
            return Ok(new { message = "movie removed from wishlist" });
        }


        [HttpGet("wishlist")]
        public async Task<IActionResult> GetWishList()
        {
            var userIdStr = HttpContext.Session.GetString("User Id");
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();

            }
            var wishlist = await _context.Wishlists.Where(w => w.UserId == userId).ToListAsync();
            return Ok(wishlist);
        }
    }
}
