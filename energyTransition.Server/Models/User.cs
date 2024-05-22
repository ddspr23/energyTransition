using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace energyTransition.Server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(30)]
        public string email { get; set; }

        [Required]
        [MaxLength(70)]
        public string password { get; set; }

        [ForeignKey("SettingFK")]
        public Settings Settings { get; set; }
        public int SettingFK {  get; set; }
    }
}
