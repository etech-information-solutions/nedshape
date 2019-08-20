using System;
using System.ComponentModel.DataAnnotations;

namespace NedShape.UI.Models
{
    public class RegisterViewModel
    {
        [Required]
        [Display( Name = "User name" )]
        public string UserName { get; set; }

        [Required]
        [StringLength( 100, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 6 )]
        [DataType( DataType.Password )]
        [Display( Name = "Password" )]
        public string Password { get; set; }

        [DataType( DataType.Password )]
        [Display( Name = "Confirm password" )]
        [Compare( "Password", ErrorMessage = "The password and confirmation password do not match." )]
        public string ConfirmPassword { get; set; }
    }
}
