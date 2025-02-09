using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace WbApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public HomeController(HttpClient httpClient,IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetMovies()
        {
            try
            {
                var apiKey = _configuration["ApiKeyOmDb"];
                var response = await _httpClient.GetAsync($"http://www.omdbapi.com/?s=batman&apikey={apiKey}");

                if (response.IsSuccessStatusCode)
                {
                    var movies = await response.Content.ReadAsStringAsync();
                    return Ok(movies);
                }
                return BadRequest("Error fetching data");
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
