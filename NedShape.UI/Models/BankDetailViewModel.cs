using System;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;

namespace NedShape.UI.Models
{
    public class BankDetailViewModel
    {
        #region Properties

        public int Id { get; set; }

        public int UserId { get; set; }

        public int BankId { get; set; }
        
        [Display( Name = "Beneficiary" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Beneficiary { get; set; }
        
        [Display( Name = "Account" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Account { get; set; }

        [Display( Name = "Branch" )]
        [StringLength( 6, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Branch { get; set; }
        
        [Display( Name = "Account Type" )]
        public BankAccountType AccountType { get; set; }
        
        [Display( Name = "Status" )]
        public Status Status { get; set; }

        public bool EditMode { get; set; }

        #endregion

        #region Model Options



        #endregion
    }
}