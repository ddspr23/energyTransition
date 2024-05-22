using energyTransition.Server.DTO;
using energyTransition.Server.Models;

using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace energyTransition.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private ApplicationDbContext _context;
        private IConfiguration _configuration;

        [ActivatorUtilitiesConstructor]
        public UserController(ApplicationDbContext _c, IConfiguration configuration)
        {
            _context = _c;
            _configuration = configuration;
        }

        public static string HashPassword(string password)
        {
            byte[] salt;
            byte[] buffer2;
            if (password == null)
            {
                throw new ArgumentNullException("No password given!");
            }
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, 0x10, 0x3e8))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }
        public static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] buffer4;
            if (hashedPassword == null)
            {
                return false;
            }
            if (password == null)
            {
                throw new ArgumentNullException("No password given!");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, dst, 0x3e8))
            {
                buffer4 = bytes.GetBytes(0x20);
            }

            return buffer3.SequenceEqual<byte>(buffer4);
        }

        [HttpPost("/signup")]
        public IActionResult Post([FromBody] SignupDTO dto)
        {
            if(dto == null)
            {
                return BadRequest(new ErrorDTO { Message = "Please enter a valid email/username or password!" });
            }

            string password = dto.password;
            password = HashPassword(password);

            var setting = _context.Settings.Add(new Settings
            {
                displayLine = dto.displayLine,
                cardOrder = ""
            });

            _context.Users.Add(new Models.User
            {
                UserName = dto.username,
                email = dto.email,
                password = password,
                Settings = setting.Entity
            });
    
            _context.SaveChanges();
            var usr = _context.Users.FirstOrDefault(u => u.email == dto.email);
            if(usr == null)
            {
                return BadRequest(new ErrorDTO { Message = "An error occured" });
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            
            var tok = new JwtSecurityToken(_configuration["Jwt:Issuer"], usr.Id.ToString(), null, expires: DateTime.UtcNow.AddHours(24), signingCredentials: credentials);
            var ret = new JwtSecurityTokenHandler().WriteToken(tok);


            return Ok(new ResponseDTO { token=ret, username = dto.username });
        }

        [HttpPost("/auth")]
        public IActionResult Post([FromBody] LoginDTO dto)
        {
            if(dto == null)
            {
                return BadRequest(new ErrorDTO { Message = "Please enter a valid email/pasword!" });
            }

            var usr = _context.Users.Where(us => us.email == dto.email).FirstOrDefault();
            if(usr == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid email/password!" });
            }

            if(VerifyHashedPassword(usr.password, dto.password))
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var tok = new JwtSecurityToken(_configuration["Jwt:Issuer"], usr.Id.ToString(), expires: DateTime.UtcNow.AddHours(24), signingCredentials: credentials);
                var ret = new JwtSecurityTokenHandler().WriteToken(tok);


                return Ok(new ResponseDTO { token = ret, username=usr.UserName });
            }

            return BadRequest(new ErrorDTO { Message = "Invalid email/password!" });

        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("/state")]
        public async Task<IActionResult> Post([FromBody] SettingDTO dto)
        {
            var bt = HttpContext.GetTokenAsync("access_token");
            string btok = await bt;
            if(btok == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid token given!" });
            }

            var jwtHandler = new JwtSecurityTokenHandler();
            var storedToken = jwtHandler.ReadJwtToken(btok);
            if(storedToken.Claims == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid token!" });
            }
            string id = storedToken.Claims.FirstOrDefault(str => str.Type == "aud").Value;

            if(id == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid token!" });
            }

            User? user = _context.Users.FirstOrDefault(u => u.Id == Int32.Parse(id));
            if(user == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid user!" });
            }
            Settings? settings = _context.Settings.FirstOrDefault(s => s.SettingId == user.SettingFK);

            if (user == null || settings == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid user!" });
            }


            if(!_context.Cards.Any(c => c.Settings.SettingId == user.SettingFK))
            {
                foreach (Card i in dto.Cards)
                {
                    _context.Cards.Add(new Cards
                    {
                        Settings = settings,
                        Card = i
                    });
                }

                var s = _context.Settings.Find(user.SettingFK);
                if(s != null)
                {
                    s.displayLine = dto.displayLine;
                    s.cardOrder = dto.order;
                }
            } else
            {
                foreach (Card i in dto.Cards)
                {
                    var cards = _context.Cards.FirstOrDefault(cs => cs.Settings.SettingId == user.SettingFK && cs.Card.realCardId == i.realCardId);
                    var card = _context.Card.FirstOrDefault(c => c.Id == cards.cardId);
                    if (card == null)
                    {
                        return BadRequest(new ErrorDTO { Message = "Invalid settings!" });
                    }

                    card.realCardId = i.realCardId;
                    card.color = i.color;
                }

                var s = _context.Settings.Find(user.SettingFK);
                if (s != null)
                {
                    s.displayLine = dto.displayLine;
                    s.cardOrder = dto.order;
                }
            }

            _context.SaveChanges();

            return Ok("OK");
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("/settings")]
        public async Task<IActionResult> Get()
        {
            var bt = HttpContext.GetTokenAsync("access_token");
            string btok = await bt;
            if (btok == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid token given!" });
            }

            var jwtHandler = new JwtSecurityTokenHandler();
            var storedToken = jwtHandler.ReadJwtToken(btok);
            if (storedToken.Claims == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid token!" });
            }
            string id = storedToken.Claims.FirstOrDefault(str => str.Type == "aud").Value;

            if (id == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid token!" });
            }

            User? user = _context.Users.FirstOrDefault(u => u.Id == Int32.Parse(id));
            if (user == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid user!" });
            }

            SettingDTO setting = new SettingDTO();
            Settings? currs = _context.Settings.FirstOrDefault(s => s.SettingId == user.SettingFK);
            if (currs == null)
            {
                return BadRequest(new ErrorDTO { Message = "Invalid setting config!" });
            }
            var ids = new List<int>();
            var cards = _context.Cards.Where(c => c.Settings.SettingId == user.SettingFK).ToList();
            foreach(var i in cards)
            {
                ids.Add(i.cardId);
            }

            setting.displayLine = currs.displayLine;
            setting.order = currs.cardOrder;
            setting.Cards = _context.Card.Where(c => ids.Contains(c.Id)).ToList();

            return Ok(setting);
        }
    }

    
}
