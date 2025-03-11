using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieApiApp.Helpers;
using System.Diagnostics;
using System.Security.Claims;
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
        public async Task<IActionResult> AddToWishlist([FromBody] WishList wishlistDto)
        {
            int userId = HttpContext.GetUserIdFromToken() ?? 0;
            if (userId == 0)
            {
                return Unauthorized(new { messge = "User Not found" });
            }
            var wishlist = new WishList
            {
                UserId = userId,
                MovieId = wishlistDto.MovieId,
                MovieTitle = wishlistDto.MovieTitle,
                MoviePoster = wishlistDto.MoviePoster
            };

            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie added to wishlist" });
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromWishlist([FromBody] MovieDel movieDel)
        {
            if (movieDel == null || string.IsNullOrEmpty(movieDel.MovieId))
            {
                return BadRequest("Invalid payload or MovieId is null/empty.");
            }

            var userId = HttpContext.GetUserIdFromToken();
            if (userId == 0)
            {
                return Unauthorized(new { messge = "User Not found" });
            }
            var wishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.MovieId == movieDel.MovieId && w.UserId == userId);

            if (wishlistItem == null)
            {
                return NotFound("Movie not found in wishlist.");
            }

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Movie removed from wishlist" });
        }



        [HttpGet("wishlist")]
        public async Task<IActionResult> GetWishList()

        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not logged in.");
            }
            int userId = int.Parse(userIdClaim.Value);


            var wishlist = await _context.Wishlists.Where(w => w.UserId == userId).ToListAsync();
            return Ok(wishlist);
        }
    }
}
