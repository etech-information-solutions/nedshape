using System.ComponentModel.DataAnnotations;

namespace NedShape.UI.Models
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [Display( Name = "Email Address" )]
        public string Email { get; set; }
    }
}
