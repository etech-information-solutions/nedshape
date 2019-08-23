using NedShape.Core.Enums;
using NedShape.UI.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NedShape.UI.Controllers
{
    [Requires( PermissionTo.View, PermissionContext.Gyms )]
    public class GymsController : Controller
    {
        // GET: Gyms
        public ActionResult Index()
        {
            return View();
        }
    }
}