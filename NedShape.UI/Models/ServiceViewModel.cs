using System;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;

namespace NedShape.UI.Models
{
    public class ServiceViewModel
    {
        #region Properties

        public int Id { get; set; }

        [Required]
        [Display( Name = "Name" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Name { get; set; }

        [Required]
        [Display( Name = "Description" )]
        [StringLength( 500, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Description { get; set; }

        [Display( Name = "Price" )]
        public decimal? Price { get; set; }

        [Required]
        [Display( Name = "Status" )]
        public Status Status { get; set; }

        public GymTimeViewModel GymTime { get; set; }

        public bool EditMode { get; set; }

        #endregion

        #region Model Options



        #endregion
    }
}