﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NedShape.Core.Interfaces
{
    public interface IPermission
    {
        string[] ToAspNetRoles();
    }
}
