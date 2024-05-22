using energyTransition.Server.Models;

namespace energyTransition.Server.DTO
{
    public class SettingDTO
    {
        public bool displayLine {  get; set; }
        public List<Card> Cards { get; set; }
        public string order {  get; set; } // order of cards e.g. 456123 order of card ids.
    }
}
