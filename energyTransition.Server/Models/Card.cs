using System.ComponentModel.DataAnnotations;

namespace energyTransition.Server.Models
{
    public class Card
    {
        [Key]
        public int Id { get; set; } // the card id visible to other tables.
        [Required]
        public int realCardId { get; set; } // the card Id inside react
        [Required]
        public string color { get; set; }
    }
}
