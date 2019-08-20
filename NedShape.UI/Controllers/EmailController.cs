
using System;
using System.Web.Mvc;
using NedShape.UI.Models;
using NedShape.Data.Models;
using NedShape.Core.Services;

namespace NedShape.UI.Controllers
{
    public class EmailController : BaseController
    {
        public ActionResult ResetPassword( Guid token, User user )
        {
            ViewBag.Token = token;

            return PartialView( "_ResetPassword", user );
        }

        public ActionResult UserApproved( UserViewModel user )
        {
            return PartialView( "_UserApproved", user );
        }

        public ActionResult UserWelcome( SignUpViewModel user )
        {
            return PartialView( "_UserWelcome", user );
        }

        public ActionResult UserWelcome1( SignUpViewModel user )
        {
            return PartialView( "_UserWelcome1", user );
        }

        public ActionResult UserDecline( UserViewModel user )
        {
            return PartialView( "_UserDecline", user );
        }

        public ActionResult PaymentNotification()
        {
            return PartialView( "_PaymentNotification" );
        }
    }
}
