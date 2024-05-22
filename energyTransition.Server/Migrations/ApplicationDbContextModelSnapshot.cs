﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using energyTransition.Server;

#nullable disable

namespace energyTransition.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("energyTransition.Server.Models.Card", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("color")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("realCardId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Card");
                });

            modelBuilder.Entity("energyTransition.Server.Models.Cards", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("cardId")
                        .HasColumnType("int");

                    b.Property<int>("settingId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("cardId");

                    b.HasIndex("settingId");

                    b.ToTable("Cards");
                });

            modelBuilder.Entity("energyTransition.Server.Models.Settings", b =>
                {
                    b.Property<int>("SettingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("SettingId"));

                    b.Property<string>("cardOrder")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<bool>("displayLine")
                        .HasColumnType("tinyint(1)");

                    b.HasKey("SettingId");

                    b.ToTable("Settings");
                });

            modelBuilder.Entity("energyTransition.Server.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("SettingFK")
                        .HasColumnType("int");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("varchar(10)");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("varchar(30)");

                    b.Property<string>("password")
                        .IsRequired()
                        .HasMaxLength(70)
                        .HasColumnType("varchar(70)");

                    b.HasKey("Id");

                    b.HasIndex("SettingFK");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("energyTransition.Server.Models.Cards", b =>
                {
                    b.HasOne("energyTransition.Server.Models.Card", "Card")
                        .WithMany()
                        .HasForeignKey("cardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("energyTransition.Server.Models.Settings", "Settings")
                        .WithMany()
                        .HasForeignKey("settingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Card");

                    b.Navigation("Settings");
                });

            modelBuilder.Entity("energyTransition.Server.Models.User", b =>
                {
                    b.HasOne("energyTransition.Server.Models.Settings", "Settings")
                        .WithMany()
                        .HasForeignKey("SettingFK")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Settings");
                });
#pragma warning restore 612, 618
        }
    }
}
