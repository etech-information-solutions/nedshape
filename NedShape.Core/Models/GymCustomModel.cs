using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NedShape.Core.Models
{
    public class GymCustomModel
    {
        public int Id { get; set; }
        public Nullable<int> ApprovedBy { get; set; }
        public string ApprovedByUser { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByUser { get; set; }
        public System.DateTime ModifiedOn { get; set; }
        public int ModifiedBy { get; set; }
        public string Name { get; set; }
        public string TradingName { get; set; }
        public string RegNo { get; set; }
        public string Email { get; set; }
        public string Cell { get; set; }
        public string Fax { get; set; }
        public string Reference { get; set; }
        public string POPEmail { get; set; }
        public string CompanyEmail { get; set; }
        public string ContactPerson { get; set; }
        public string ContactTel { get; set; }
        public string ContactEmail { get; set; }
        public string ContactCell { get; set; }
        public int Status { get; set; }
        public System.DateTime StatusDate { get; set; }
        public string VATNo { get; set; }
        public string Website { get; set; }
        public bool Approved { get; set; }
        public Nullable<System.DateTime> ApprovedOn { get; set; }
        public string ApproverComments { get; set; }

        public int UserCount { get; set; }

        public int MemberCount { get; set; }

        public int AddressCount { get; set; }

        public int ImageCount { get; set; }

        public int DocumentCount { get; set; }

        public int BankCount { get; set; }

        public int ServiceCount { get; set; }
    }
}
