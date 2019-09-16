
using System;
using System.ComponentModel.DataAnnotations;

namespace NedShape.UI.Models
{
    public class SystemConfigViewModel
    {
        #region Properties

        public int Id { get; set; }
        
        [Display( Name = "Password Change" )]
        public int PasswordChange { get; set; }
        
        [Display( Name = "Images Location" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ImagesLocation { get; set; }

        [Display( Name = "Documents Location" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string DocumentsLocation { get; set; }

        [Display( Name = "System Contact Email" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ContactEmail { get; set; }

        [Display( Name = "Financial Contact Email" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string FinancialEmail { get; set; }

        [Display( Name = "Contact Number" )]
        [StringLength( 20, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ContactNumber { get; set; }

        [Display( Name = "Address" )]
        [StringLength( 500, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Address { get; set; }

        [Display( Name = "Payment User Code" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentUserCode { get; set; }

        [Display( Name = "Payment Account" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentAccount { get; set; }

        [Display( Name = "App Download Url" )]
        [StringLength( 500, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string AppDownloadUrl { get; set; }

        [Display( Name = "DR Discount" )]
        public decimal? DRDiscount { get; set; }



        [Display( Name = "Payment Monitor Path" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentMonitorPath { get; set; }

        [Display( Name = "Payment Run Day" )]
        public int? PaymentMonitorDay { get; set; }

        [Display( Name = "Payment Monitor Start" )]
        public TimeSpan? PaymentMonitorStart { get; set; }



        [Display( Name = "Payments Export Path" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentsExportPath { get; set; }

        [Display( Name = "Statement Folder" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string StatementFolder { get; set; }

        [Display( Name = "Payment Folder" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentFolder { get; set; }

        #endregion



        #region Model Options



        #endregion
    }
}
