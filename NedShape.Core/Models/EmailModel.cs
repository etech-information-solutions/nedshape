using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace NedShape.Core.Models
{
    public class EmailModel
    {
        #region Model Properties

        public string From { get; set; }

        public string Body { get; set; }

        public string Subject { get; set; }

        public List<string> Recipients { get; set; }

        public List<Attachment> Attachments { get; set; }

        #endregion

        public EmailModel()
        {
            this.Attachments = new List<Attachment>();
        }
    }
}