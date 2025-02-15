using Form.Models;
using Microsoft.EntityFrameworkCore;
using MovieApiApp.Models;
using WbApp.Models;

namespace WbApp.Data
{
    public class MainDbContext:DbContext
    {
        public MainDbContext(DbContextOptions<MainDbContext> options):base (options) { }

      public  DbSet<User> Users { get; set; }
        public DbSet<WishList> Wishlists { get; set; }
        public DbSet<Friend> Friends { get; set; }

    }
}
