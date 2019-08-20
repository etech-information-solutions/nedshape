using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Dynamic;
using System.Data.Entity;
using NedShape.Data.Models;

namespace NedShape.Core.Services
{
    public class SystemConfigService : BaseService<SystemConfig>, IDisposable
    {
        public SystemConfigService()
        {

        }

        public SystemConfig Get()
        {
            return context.SystemConfigs.FirstOrDefault();
        }
    }
}
