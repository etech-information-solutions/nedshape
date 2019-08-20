﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NedShape.Core.Enums;

namespace NedShape.Core.Models
{
    public class SimpleUserModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string IdNumber { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public string Branch { get; set; }

        public RoleType RoleType { get; set; }

        public Enums.Status Status { get; set; }

        public bool IsAlternateStandIn { get; set; }
    }
}
