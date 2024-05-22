using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace energyTransition.Server.Models
{
    public class Settings
    {
        [Key]
        public int SettingId {  get; set; }
        public bool displayLine {  get; set; }
        public string cardOrder {  get; set; }
    }
}
