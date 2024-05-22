using energyTransition.Server.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;

namespace energyTransition.Server
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<Cards> Cards { get; set; }
        public DbSet<Card> Card {  get; set; }

        public ApplicationDbContext() : base() {
            //
            base.Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            MySqlConnectionStringBuilder _sql = new()
            {
                Server = "localhost",
                Port = 3306,
                Database = "energytransition",
                UserID = "root",
                Password = "Day##n@786",
            };

            optionsBuilder.UseMySql(_sql.ToString(), ServerVersion.AutoDetect(_sql.ToString()));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>();
            modelBuilder.Entity<Settings>();
            modelBuilder.Entity<Cards>();
        }
    }
}
