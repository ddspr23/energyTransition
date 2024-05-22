using energyTransition.Server.Models;

namespace energyTransition.Server.DTO
{
    public class SettingDTO
    {
        public bool line1 {  get; set; }
        public bool line2 { get; set; }
        public bool line3 { get; set; }
        public List<Card> Cards { get; set; }
        public string order {  get; set; } // order of cards e.g. 456123 order of card ids.
    }
}
