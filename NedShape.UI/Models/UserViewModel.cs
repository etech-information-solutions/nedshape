using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;
using NedShape.Core.Services;
using NedShape.Data.Models;

namespace NedShape.UI.Models
{
    public class UserViewModel
    {
        #region Properties

        public int Id { get; set; }

        [Required]
        [Display( Name = "Role" )]
        public int RoleId { get; set; }

        public Role Role { get; set; }

        [Display( Name = "Decline Reason" )]
        public int DeclineReasonId { get; set; }

        [Required]
        [Display( Name = "Name" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Name { get; set; }

        [Required]
        [Display( Name = "Surname" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Surname { get; set; }

        [Required]
        [Display( Name = "Email Address" )]
        [DataType( DataType.EmailAddress )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Email { get; set; }

        [Required]
        [Display( Name = "ID Number" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string IdNumber { get; set; }

        [Display( Name = "IsSAId" )]
        public bool IsSAId { get; set; }

        [Required]
        [Display( Name = "Cellphone Number" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Cell { get; set; }

        [Display( Name = "Tax Number" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string TaxNumber { get; set; }

        [Display( Name = "Password" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Password { get; set; }

        [Display( Name = "Confirm Password" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ConfirmPassword { get; set; }

        [Required]
        [Display( Name = "Date Of Birth" )]
        public DateTime DateOfBirth { get; set; }



        public BankDetailViewModel BankDetails { get; set; }

        public List<AddressViewModel> Addresses { get; set; }



        [Required]
        [Display( Name = "Status" )]
        public Status Status { get; set; }

        public string Comment { get; set; }

        public bool EditMode { get; set; }

        #endregion

        #region Model Options 

        

        #endregion
    }
}