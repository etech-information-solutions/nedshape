﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NedShape.Core.Attributes
{

    [AttributeUsage( AttributeTargets.Class | AttributeTargets.Interface, AllowMultiple = false, Inherited = true )]
    public class ViewModelAttribute : Attribute
    {
    }
}
