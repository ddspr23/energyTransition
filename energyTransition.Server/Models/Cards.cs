using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace energyTransition.Server.Models
{
    public class Cards
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("settingId")]
        public Settings Settings { get; set; }

        [ForeignKey("cardId")]
        public int cardId { get; set; }
        public Card Card { get; set; }
    }
}
