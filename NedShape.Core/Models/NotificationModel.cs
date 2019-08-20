using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NedShape.Core.Enums;

namespace NedShape.Core.Models
{
    public class NotificationModel
    {
        #region Properties

        public string Message { get; set; }

        public NotificationType Type { get; set; }

        #endregion
    }
}