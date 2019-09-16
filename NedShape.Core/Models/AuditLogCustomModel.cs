using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NedShape.Data.Models;

namespace NedShape.Core.Models
{
    public class AuditLogCustomModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Nullable<int> ObjectId { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public System.DateTime ModifiedOn { get; set; }
        public int ModifiedBy { get; set; }
        public int Type { get; set; }
        public string ActionTable { get; set; }
        public bool IsAjaxRequest { get; set; }
        public string Parameters { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Comments { get; set; }
        public string Browser { get; set; }
        public string BeforeImage { get; set; }
        public string AfterImage { get; set; }

        public string UserName { get; set; }

        public User User { get; set; }
    }
}
