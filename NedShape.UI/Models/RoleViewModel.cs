using System;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;

namespace NedShape.UI.Models
{
    public class RoleViewModel
    {
        #region Properties

        public int Id { get; set; }

        [Required]
        [Display( Name = "Name" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Name { get; set; }
        
        [Display( Name = "Type" )]
        public RoleType Type { get; set; }

        [Display( Name = "Dashboard" )]
        public bool DashBoard { get; set; }

        [Display( Name = "Clients" )]
        public bool Clients { get; set; }

        [Display( Name = "Services" )]
        public bool Services { get; set; }

        [Display( Name = "Members" )]
        public bool Members { get; set; }

        [Display( Name = "Gyms" )]
        public bool Gyms { get; set; }

        [Display( Name = "Financials" )]
        public bool Financials { get; set; }

        [Display( Name = "Administration" )]
        public bool Administration { get; set; }

        [Display( Name = "Reports" )]
        public bool Reports { get; set; }

        [Display( Name = "Profile" )]
        public bool Profile { get; set; }

        [Display( Name = "Statements" )]
        public bool Statements { get; set; }

        public bool EditMode { get; set; }

        #endregion



        #region Model Options



        #endregion
    }
}