using Form.Models;

namespace Form.Models
{
    public class Comments
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string MovieId { get; set; }
        public string CommentText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}