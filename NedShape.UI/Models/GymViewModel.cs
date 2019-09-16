using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;

namespace NedShape.UI.Models
{
    public class GymViewModel
    {
        #region Properties

        public int Id { get; set; }

        [Required]
        [Display( Name = "Name" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Name { get; set; }

        [Required]
        [Display( Name = "Trading Name" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string TradingName { get; set; }

        [Display( Name = "Reg #" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string RegNo { get; set; }

        [Display( Name = "Company Email" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string CompanyEmail { get; set; }

        [Display( Name = "Contact Email" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ContactEmail { get; set; }

        [Display( Name = "POP Email" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string POPEmail { get; set; }

        [Display( Name = "Contact Person" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ContactPerson { get; set; }

        [Display( Name = "Contact Tel" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ContactTel { get; set; }

        [Display( Name = "Contact Cell" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ContactCell { get; set; }

        [Display( Name = "Fax" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Fax { get; set; }

        [Display( Name = "VAT #" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string VATNo { get; set; }

        [Display( Name = "Website" )]
        [StringLength( 255, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Website { get; set; }

        [Display( Name = "Approved" )]
        public YesNo Approved { get; set; }

        [Display( Name = "Your Approval Comment" )]
        [StringLength( 250, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ApproverComment { get; set; }

        [Required]
        [Display( Name = "Status" )]
        public GymStatus Status { get; set; }

        public bool EditMode { get; set; }

        public List<BankDetailViewModel> BankDetails { get; set; }

        public List<FileViewModel> Files { get; set; }

        public List<AddressViewModel> Addresses { get; set; }

        public List<ServiceViewModel> Services { get; set; }

        #endregion



        #region Model Options



        #endregion
    }
}