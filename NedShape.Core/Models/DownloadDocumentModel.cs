using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NedShape.Core.Models
{
    public class DownloadDocumentModel
    {
        public int Code { get; set; }

        public string Message { get; set; }

        public string Url { get; set; }

        public string Name { get; set; }

        public string Mime { get; set; }

        public decimal Size { get; set; }

        public string Extension { get; set; }
    }
}
