using Form.Models;
using Microsoft.EntityFrameworkCore;
using WbApp.Models;

namespace WbApp.Data
{
    public class MainDbContext:DbContext
    {
        public MainDbContext(DbContextOptions<MainDbContext> options):base (options) { }

      public  DbSet<User> Users { get; set; }
        public DbSet<WishList> Wishlists { get; set; }

    }
}
