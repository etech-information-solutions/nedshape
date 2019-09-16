using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NedShape.Core.Models
{
    public class ServiceCustomModel
    {
        public int Id { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByUser { get; set; }
        public System.DateTime ModifiedOn { get; set; }
        public string ModifiedByUser { get; set; }
        public int ModifiedBy { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Nullable<int> Status { get; set; }
        public Nullable<decimal> Price { get; set; }


        public int? GymCount { get; set; }
    }
}
