using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NedShape.Core.Enums;

namespace NedShape.Core.Models
{
    public class SimpleBankModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public Enums.Status Status { get; set; }
    }
}
