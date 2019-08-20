
namespace NedShape.Core.Models
{
    public class BankDetailModel
    {
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public int? BankId { get; set; }
        public System.DateTime? CreatedOn { get; set; }
        public System.DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string Beneficiary { get; set; }
        public string Account { get; set; }
        public string Branch { get; set; }
        public int? AccountType { get; set; }
        public int? Status { get; set; }
    }
}
