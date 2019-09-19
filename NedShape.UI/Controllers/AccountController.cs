using System;
using System.Web;
using System.Linq;
using System.Web.Mvc;
using NedShape.UI.Models;
using NedShape.Core.Services;
using System.Web.Security;
using NedShape.Core.Models;
using NedShape.Core.Enums;
using NedShape.Data.Models;
using System.Transactions;
using System.IO;

namespace NedShape.UI.Controllers
{
    public class AccountController : BaseController
    {
        //
        // GET: /Account/Index
        public ActionResult Index()
        {
            if ( Request.IsAuthenticated )
            {
                return RedirectToAction( "Index", "DashBoard" );
            }

            return RedirectToAction( "Login" );
        }

        //
        // GET: /Account/Login
        public ActionResult Login()
        {
            if ( Request.IsAuthenticated )
            {
                Notify( "You're already logged in, what would you like to do next? Please contact us if you require any help.", NotificationType.Warn );

                return RedirectToAction( "Index", "DashBoard" );
            }

            LoginViewModel model = new LoginViewModel();

            return View( model );
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login( LoginViewModel model, string returnUrl )
        {
            // Model valid?
            if ( !ModelState.IsValid )
            {
                // If we got this far, something failed, redisplay form
                Notify( "The supplied information is invalid. Please try again.", NotificationType.Error );

                return View( model );
            }

            UserModel user;

            using ( UserService service = new UserService() )
            {
                user = service.Login( model.UserName, model.Password );
            }

            // User valid?
            if ( user == null )
            {
                // If we got this far, something failed, redisplay form
                Notify( "The user name or password provided is incorrect.", NotificationType.Error );

                return View( model );
            }

            CustomExpiration( user, 3600 );

            switch ( user.RoleType )
            {
                case RoleType.Member:

                    return RedirectToAction( "Index", "Profile" );

                case RoleType.GymUser:

                    return RedirectToAction( "Index", "Gyms" );

                case RoleType.FinancialUser:

                    return RedirectToAction( "Index", "Financials" );

                case RoleType.SystemOperator:

                    return RedirectToAction( "Index", "Administration" );

                case RoleType.SystemAdministrator:

                    return RedirectToAction( "Index", "Administration" );

                default:

                    return RedirectToAction( "Index", "DashBoard" );
            }
        }

        //
        // GET: /Account/ForgotPassword
        public ActionResult ForgotPassword()
        {
            if ( Request.IsAuthenticated )
            {
                Notify( "You're already logged in, what would you like to do next? Please contact us if you require any help.", NotificationType.Warn );

                return RedirectToAction( "Index", "DashBoard" );
            }

            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ForgotPassword( ForgotPasswordViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "The supplied information is invalid. Please try again.", NotificationType.Error );

                return View( model );
            }

            using ( UserService uservice = new UserService() )
            using ( TokenService tservice = new TokenService() )
            {
                User user = uservice.GetByEmail( model.Email );

                if ( user == null )
                {
                    Notify( "The e-mail address provided is incorrect.", NotificationType.Error );

                    return View( model );
                }

                Token t = new Token()
                {
                    UserId = user.Id,
                    UID = Guid.NewGuid(),
                    Status = ( int ) Status.Active
                };

                t = tservice.Create( t );

                user.Reset = true;

                user = uservice.Update( user );

                Boolean sent = SendResetPassword( t.UID, user );

                if ( sent )
                {
                    Notify( "A Password Reset Request has been sent to your Email Address.", NotificationType.Success );
                }
                else
                {
                    Notify( "Sorry, a Password Reset Request could not be sent. Please try again later.", NotificationType.Warn );
                }
            }

            return View( model );
        }

        //
        // GET: /Account/ResetPassword
        public ActionResult ResetPassword( Guid uid )
        {
            if ( Request.IsAuthenticated )
            {
                Notify( "You're already logged in, what would you like to do next? Please contact us if you require any help.", NotificationType.Warn );

                return RedirectToAction( "Index", "DashBoard" );
            }

            // Token is available?
            if ( uid == null )
            {
                Notify( "The supplied information is invalid. Please try again.", NotificationType.Error );

                return RedirectToAction( "Login" );
            }

            using ( TokenService service = new TokenService() )
            {
                // Token is valid?
                if ( !service.Exist( uid, DateTime.Now ) )
                {
                    Notify( "The supplied token is no longer valid. Please try again.", NotificationType.Error );

                    return RedirectToAction( "Login" );
                }
            }

            ResetPasswordViewModel model = new ResetPasswordViewModel() { UID = uid };

            return View( model );
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ResetPassword( ResetPasswordViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "The supplied information is invalid. Please try again.", NotificationType.Error );

                return ResetPassword( model.UID );
            }

            // Token is available?
            if ( model?.UID == null )
            {
                Notify( "The supplied information is invalid. Please try again.", NotificationType.Error );

                return ResetPassword( model.UID );
            }

            using ( UserService uservice = new UserService() )
            using ( TokenService tservice = new TokenService() )
            using ( TransactionScope scope = new TransactionScope() )
            {
                // Token is valid?
                if ( !tservice.Exist( model.UID, DateTime.Now ) )
                {
                    Notify( "The supplied token is no longer valid. Please try again.", NotificationType.Error );

                    return ResetPassword( model.UID );
                }

                // Password mismatch?
                if ( !string.Equals( model.Password, model.ConfirmPassword, StringComparison.CurrentCulture ) )
                {
                    Notify( "Password combination does not match. Please try again.", NotificationType.Error );

                    return View( model );
                }

                Token t = tservice.GetByUid( model.UID );
                User user = uservice.GetById( t.UserId );

                t.Status = ( int ) Status.Inactive;

                user.Reset = false;
                user.PasswordDate = DateTime.Now;
                user.Password = uservice.GetSha1Md5String( model.Password );

                tservice.Update( t );
                uservice.Update( user );

                scope.Complete();
            }

            Notify( "Your password was successfully updated. You can proceed and login below.", NotificationType.Success );

            return RedirectToAction( "Login" );
        }

        //
        // GET: /Account/SignUp
        public ActionResult SignUp()
        {
            if ( Request.IsAuthenticated )
            {
                return RedirectToAction( "Index", "DashBoard" );
            }

            SignUpViewModel model = new SignUpViewModel() { EditMode = true, IsSAId = null };

            return View( model );
        }

        

        //
        // GET: /Account/SignUp
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SignUp( SignUpViewModel model )
        {
            if ( !ModelState.IsValid && model.BankDetails?.BankId != 0 )
            {
                Notify( "The supplied information is invalid. Please try again.", NotificationType.Error );

                return View( model );
            }

            User user;

            using ( UserService uservice = new UserService() )
            using ( RoleService rservice = new RoleService() )
            using ( ImageService iservice = new ImageService() )
            using ( AddressService aservice = new AddressService() )
            using ( TransactionScope scope = new TransactionScope() )
            using ( BankDetailService bservice = new BankDetailService() )
            {
                #region Validations

                // Check user does not exist by email address
                if ( uservice.ExistByEmail( model.Email?.Trim() ) )
                {
                    Notify( $"An Agent with the Email Address {model.Email} already exists. Contact us if you require further assistance.", NotificationType.Error );

                    return View( model );
                }

                // Check user does not exist by Id Number
                if ( uservice.ExistByIdNumber( model.IdNumber?.Trim() ) )
                {
                    Notify( $"An Agent with the ID Number {model.IdNumber} already exists. Contact us if you require further assistance.", NotificationType.Error );

                    return View( model );
                }

                // Validate ID Number

                // Validate Bank Details
                //if ( model.PaymentMethod == PaymentMethod.Bank && ValidateBankDetails( model.BankDetails?.Account, model.BankDetails?.Branch, ( int ) model.BankDetails?.AccountType )?.Code != 0 )
                //{
                //    Notify( $"The provided Banks Details may not be valid. Contact us if you require further assistance.", NotificationType.Error );

                //    return View( model );
                //}

                // Validate Payment Method=Cell
                //if ( model.PaymentMethod == PaymentMethod.Cell && !string.Equals( model.Cell?.Trim(), model.ConfirmCell?.Trim() ) )
                //{
                //    Notify( $"The provided Cell Phone Numbers do no match. Contact us if you require further assistance.", NotificationType.Error );

                //    return View( model );
                //}

                #endregion


                #region Create User

                user = new User()
                {
                    //Type = ( int ) RoleType.Agent,
                    //Status = ( int ) AgentStatus.Pending,
                    CreatedOn = DateTime.Now,
                    ModifiedOn = DateTime.Now,
                    UserTypeId = 2,
                    Reset = true,
                    IdNumber = model.IdNumber,
                    TaxNumber = model.TaxNumber,
                    IsSAId = model.IsSAId == YesNo.Yes,
                    Name = model.Name,
                    Surname = model.Surname,
                    Email = model.Email,
                    Cell = model.Cell,
                    DateOfBirth = model.DateOfBirth,
                    PasswordDate = DateTime.Now,
                    Password = uservice.GetSha1Md5String( model.IdNumber?.Trim().Substring( 0, 5 ) )
                };

                // Get Agent Role
                //Role role = rservice.GetByName( RoleType.Agent.GetStringValue() );


                //Role == 1 for now(new user)
                    user = uservice.Create( user,  1);

                #endregion


                #region Create Address (s)

                if ( model.Addresses != null && model.Addresses.NullableAny() )
                {
                    foreach ( AddressViewModel a in model.Addresses )
                    {
                        Address address = new Address()
                        {
                            ObjectId = user.Id,
                            ObjectType = "User",
                            Addressline1 = a.AddressLine1,
                            Addressline2 = a.AddressLine2,
                            Town = a.Town,
                            PostalCode = a.PostalCode,
                            Province = ( int ) a.Province,
                            Type = ( int ) a.AddressType,
                            Status = ( int ) Status.Active
                        };

                        aservice.Create( address );
                    }
                }

                #endregion


                #region Create Bank Details

                if ( model.BankDetails != null && model.BankDetails?.BankId > 0 )
                {
                    BankDetail bank = new BankDetail()
                    {
                        ObjectId = user.Id,
                        ObjectType = "User",
                        BankId = model.BankDetails.BankId,
                        Beneficiary = model.BankDetails.Beneficiary,
                        Account = model.BankDetails.Account,
                        Branch = model.BankDetails.Branch,
                        AccountType = ( int ) model.BankDetails.AccountType,
                        Status = ( int ) Status.Active
                    };

                    bservice.Create( bank );
                }

                #endregion


                #region Any Uploads

                if ( model.Files != null && model.Files.Any( f => f.File != null ) )
                {
                    // Create folder
                    string path = Server.MapPath( $"~/{VariableExtension.SystemRules.ImagesLocation}/Members/{user.IdNumber?.Trim()}/" );

                    if ( !Directory.Exists( path ) )
                    {
                        Directory.CreateDirectory( path );
                    }

                    string now = DateTime.Now.ToString( "yyyyMMddHHmmss" );

                    foreach ( FileViewModel f in model.Files.Where( f => f.File != null ) )
                    {
                        Image image = new Image()
                        {
                            Name = f.Name,
                            ObjectId = user.Id,
                            ObjectType = "User",
                            Size = f.File.ContentLength,
                            Description = f.Description,
                            IsMain = ( f.Name.ToLower() == "selfie" ),
                            Extension = Path.GetExtension( f.File.FileName ),
                            Location = $"Members/{user.IdNumber?.Trim()}/{now}-{f.File.FileName}"
                        };

                        iservice.Create( image );

                        string fullpath = Path.Combine( path, $"{now}-{f.File.FileName}" );
                        f.File.SaveAs( fullpath );
                    }
                }

                #endregion

                // Complete the scope
                scope.Complete();
            }

            // Send Welcome Email
            bool sent = SendUserWelcome( model );
            if (sent != true){
                Notify("Sign up not conneced.", NotificationType.Error);
                return RedirectToAction("SignUp");
            }
            else {
                Notify("Your Agent Account was successfully created. An email with further details has been sent to you.", NotificationType.Success);
                return RedirectToAction("Login");
            }

            

           
        }

        /// <summary>
        /// Simply creates a Custom Authentication
        /// </summary>
        /// <param name="model"></param>
        /// <param name="expires"></param>
        private void CustomExpiration( UserModel model, int expires )
        {
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket( model.Email, true, ( expires / 60 ) );

            // Encrypt the ticket.
            string encTicket = FormsAuthentication.Encrypt( ticket );

            // Create the cookie.
            Response.Cookies.Add( new HttpCookie( FormsAuthentication.FormsCookieName, encTicket ) );
        }

        //
        // GET: /Account/LogOff
        public ActionResult LogOff( string returnUrl )
        {
            FormsAuthentication.SignOut();

            this.HttpContext.Cache.Remove( User.Identity.Name );

            ContextExtensions.RemoveCachedUserData();

            return RedirectToAction( "Login" );
        }

        #region Helpers

        private ActionResult RedirectToLocal( string returnUrl )
        {
            if ( Url.IsLocalUrl( returnUrl ) || IsSubDomain( returnUrl ) )
            {
                return Redirect( returnUrl );
            }
            else
            {
                return RedirectToAction( "Index", "DashBoard" );
            }
        }

        private bool IsSubDomain( string url )
        {
            if ( string.IsNullOrEmpty( url ) )
                return false;


            Uri.TryCreate( url, UriKind.Absolute, out Uri absoluteUri );

            return absoluteUri.Host.EndsWith( Request.Url.Host.Replace( "www.", "" ) );
        }

        private static string ErrorCodeToString( MembershipCreateStatus createStatus )
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch ( createStatus )
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "User name already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A user name for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }

        #endregion
    }
}
