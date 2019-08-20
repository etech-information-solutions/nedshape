
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
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ContactNumber { get; set; }

        [Display( Name = "Address" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string Address { get; set; }

        [Display( Name = "Payment User Code" )]
        [StringLength( 150, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentUserCode { get; set; }

        [Display( Name = "Payment Account" )]
        [StringLength( 50, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentAccount { get; set; }

        [Display( Name = "App Download Url" )]
        [StringLength( 500, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string AppDownloadUrl { get; set; }



        [Display( Name = "QA Monitor Path" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string QAMonitorPath { get; set; }

        [Display( Name = "QA Monitor Start" )]
        public TimeSpan? QAMonitorStart { get; set; }

        [Display( Name = "QA Monitor End" )]
        public TimeSpan? QAMonitorEnd { get; set; }

        [Display( Name = "QA Monitor Poll" )]
        public decimal? QAMonitorPoll { get; set; }



        [Display( Name = "Export Monitor Path" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ExportMonitorPath { get; set; }

        [Display( Name = "Export Monitor Start" )]
        public TimeSpan? ExportMonitorStart { get; set; }

        [Display( Name = "Export Monitor End" )]
        public TimeSpan? ExportMonitorEnd { get; set; }

        [Display( Name = "Export Monitor Poll" )]
        public decimal? ExportMonitorPoll { get; set; }



        [Display( Name = "Import Monitor Path" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string ImportMonitorPath { get; set; }

        [Display( Name = "Import Monitor Start" )]
        public TimeSpan? ImportMonitorStart { get; set; }

        [Display( Name = "Import Monitor End" )]
        public TimeSpan? ImportMonitorEnd { get; set; }

        [Display( Name = "Import Monitor Poll" )]
        public decimal? ImportMonitorPoll { get; set; }



        [Display( Name = "Payment Monitor Path" )]
        [StringLength( 200, ErrorMessage = "Only {1} characters are allowed for this field.", MinimumLength = 0 )]
        public string PaymentMonitorPath { get; set; }

        [Display( Name = "Payment Run Day" )]
        public int? PaymentMonitorDay { get; set; }

        [Display( Name = "Payment Monitor Start" )]
        public TimeSpan? PaymentMonitorStart { get; set; }

        #endregion



        #region Model Options



        #endregion
    }
}
