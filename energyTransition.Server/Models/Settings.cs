using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace energyTransition.Server.Models
{
    public class Settings
    {
        [Key]
        public int SettingId {  get; set; }
        public bool line1 {  get; set; }
        public bool line2 { get; set; }
        public bool line3 { get; set; }
        public string cardOrder {  get; set; }
    }
}
