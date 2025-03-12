using Form.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WbApp.Data;

namespace WbApp.Controllers
{
    [ApiController]
    [Route("api")]
    public class CommentsController : ControllerBase
    {
        private readonly MainDbContext _context;
        public CommentsController(MainDbContext context)
        {
            _context = context;
        }

        [HttpGet("movies/{movieId}/get-comments")]
        public async Task<IActionResult> GetComments(string movieId)
        {
            var comments = await _context.Comments.Where(c => c.MovieId == movieId).Select(c =>
                new
                {
                    Id = c.Id,
                    CommentText = c.CommentText,
                    CommentorName = c.Name,
                    CommentorId = c.UserId,
                    CreatedAt = c.CreatedAt
                }
            ).ToListAsync();
            if (comments == null)
            {
                return NotFound("No comments found for this movie.");

            }
            return Ok(comments);
        }

        [HttpPost("movies/{userId}/{movieId}/{commentText}")]
        public async Task<IActionResult> AddComment(int userId, string movieId, string commentText)
        {
            var name = await _context.Users.Where(u => u.Id == userId).Select(u => u.Name).FirstOrDefaultAsync();
            if (name == null)
            {
                return BadRequest("User not found");
            }
            var comment = new Comments
            {
                UserId = userId,
                Name = name,
                MovieId = movieId,
                CommentText = commentText,
            };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return Ok("Comment added successfully");
        }

        [HttpDelete("movies/{userId}/{movieId}/{commentId}")]
        public async Task<IActionResult> DeleteComment(int userId, string movieId, int commentId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.UserId == userId && c.MovieId == movieId && c.Id == commentId);

            if (comment == null)
            {
                return NotFound("comment not found");
            }
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return Ok("Comment Deleted Successfully");


        }
    }
}