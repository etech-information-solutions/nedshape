using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;
using NedShape.Core.Services;
using NedShape.Data.Models;

namespace NedShape.UI.Models
{
    public class SignUpViewModel
    {
        #region Properties

        public int Id { get; set; }

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
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Email { get; set; }

        [Required]
        [Display( Name = "Cellphone Number" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Cell { get; set; }

        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ConfirmCell { get; set; }


        [Required]
        [Display( Name = "ID/Passport Number" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string IdNumber { get; set; }

        [Display( Name = "Tax Number" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string TaxNumber { get; set; }

        [Required]
        [Display( Name = "Date Of Birth" )]
        public DateTime? DateOfBirth { get; set; }

        [Display( Name = "IsSAId" )]
        public YesNo? IsSAId { get; set; }

        [Display(Name = "YesMEMBER")]
        public YesNo? YesMEMBER { get; set; }

        [Display(Name = "IsCREDIT")]
        public YesNo? IsCREDIT { get; set; }

        //[Display( Name = "Payment Method" )]
        //public PaymentMethod? PaymentMethod { get; set; }

        //public AgentStatus Status { get; set; }

        [Display( Name = "You have read and agree with the Terms of signing up?" )]
        public bool IsAccpetedTC { get; set; }

        [Display(Name = "PrefferedEMAIL")]
        public YesNo? PrefferedEMAIL { get; set; }

        public BankDetailViewModel BankDetails { get; set; }

        public List<FileViewModel> Files { get; set; }

        [Required]
        public List<AddressViewModel> Addresses { get; set; }

        public bool EditMode { get; set; }

        #endregion

        #region Model Options

        public Dictionary<string, int> IdTypeOptions
        {
            get
            {
                Dictionary<string, int> options = new Dictionary<string, int>();

                foreach ( int v in Enum.GetValues( typeof( YesNo ) ) )
                {
                    options.Add( ( ( YesNo ) v ).GetDisplayText(), v );
                }

                return options;
            }
        }

        public List<Bank> BankOptions
        {
            get
            {
                using ( BankService service = new BankService() )
                {
                    return service.List();
                }
            }
        }

        #endregion
    }
}