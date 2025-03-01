using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WbApp.Data;

namespace WbApp.Controllers
{
    [Route("api")]
    [ApiController]
    public class MovieDetailsController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly MainDbContext _context;
        public MovieDetailsController(HttpClient httpClient, MainDbContext context)

        {
            _context = context;
            _httpClient = httpClient;
        }

        [HttpGet("movie_details")]
        public async Task<IActionResult> getMovieDetails(string imdbID)
        {
            var apiKey = "419a0f01";
            var url = $"http://www.omdbapi.com/?i={imdbID}&apikey={apiKey}";
            var response = await _httpClient.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var movieDetails = await response.Content.ReadAsStringAsync();
                return Ok(movieDetails);
            }
            return BadRequest("error fetching data");
        }


        [HttpGet("test-db")]
        public IActionResult TestDb()
        {
            try
            {
                var canConnect = _context.Database.CanConnect();
                return Ok(new { message = canConnect ? "Database connection successful!" : "Failed to connect to database" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
        // [HttpGet("movie_details")]
        // public async Task<IActionResult> GetMovieByTitle([FromQuery] string title)
        // {
        //     var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieTitle == title);
        //     if (movie == null) return NotFound("Movie not found");

        //     return Ok(movie);

        // }
    }

}
