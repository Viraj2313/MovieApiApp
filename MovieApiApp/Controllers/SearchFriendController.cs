using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using MovieApiApp.Models;
using WbApp.Data;

namespace MovieApiApp.Controllers
{
    [Route("api/friends")]
    [ApiController]
    public class SearchFriendController : ControllerBase
    {
        private readonly MainDbContext _context;
        public SearchFriendController(MainDbContext context)
        {
            _context = context;
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchFriend([FromQuery] string friendId)
        {

            if (string.IsNullOrEmpty(friendId))
            {
                return BadRequest("Friend Id is required");
            }
            if (!int.TryParse(friendId, out var parsedFriendId))
            {
                return BadRequest("Friend Id must be a valid integer");
            }

            var friend = await _context.Users.FirstOrDefaultAsync(u => u.Id == parsedFriendId);
            if (friend == null)
            {
                return NotFound("No user found with Id: {friendId}");
            }
            var result = new
            {
                friend.Id,
                friend.Name
            };
            return Ok(result);
        }
        [HttpPost("add_friend")]
        public async Task<IActionResult> AddFriend([FromBody] Friend dto)
        {
            _context.Friends.Add(dto);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Friend added successfully" });
        }

        //public async Task<IActionResult> RemoveFriend([FromBody] Friend friend)
        //{
        //    var friendToRemove = await _context.Friends.FirstOrDefaultAsync(f => f.FriendId == friend.FriendId);
        //    if (friendToRemove == null)
        //    {
        //        return NotFound("Friend not found");
        //    }
        //    _context.Friends.Remove(friendToRemove);
        //    await _context.SaveChangesAsync();
        //    return Ok(new { message = "Friend removed successfully" });
        //}
        [HttpGet("get_friends")]
        public async Task<IActionResult> GetFriends([FromQuery] int userId)

        {
            

            var friends = await _context.Friends.Where(w=>w.UserId== userId).ToListAsync();
            return Ok(friends);
        }
    }
}
