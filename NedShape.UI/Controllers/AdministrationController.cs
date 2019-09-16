using NedShape.Core.Enums;
using NedShape.Core.Models;
using NedShape.Core.Services;
using NedShape.Data.Models;
using NedShape.UI.Models;
using NedShape.UI.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web.Mvc;

namespace NedShape.UI.Controllers
{
    [Requires( PermissionTo.View, PermissionContext.Administration )]
    public class AdministrationController : BaseController
    {
        // GET: Administration
        public ActionResult Index()
        {
            return View();
        }



        #region Exports

        //
        // GET: /Administration/Export
        public FileContentResult Export( PagingModel pm, CustomSearchModel csm, string type = "configurations" )
        {
            string csv = "";
            string filename = string.Format( "{0}-{1}.csv", type.ToUpperInvariant(), DateTime.Now.ToString( "yyyy_MM_dd_HH_mm" ) );

            pm.Skip = 0;
            pm.Take = int.MaxValue;

            switch ( type )
            {
                case "roles":

                    #region Roles

                    csv = String.Format( "Name, Dashboard, Clients, Services, Members, Gyms, Financials, Administration, Reports, Profile, Statements {0}", Environment.NewLine );

                    List<Role> roles = new List<Role>();

                    using ( RoleService service = new RoleService() )
                    {
                        roles = service.List( pm, csm );
                    }

                    if ( roles != null && roles.Any() )
                    {
                        foreach ( Role item in roles )
                        {
                            csv = String.Format( "{0} {1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11} {12}",
                                                csv,
                                                item.Name,
                                                item.DashBoard,
                                                item.Clients,
                                                item.Services,
                                                item.Members,
                                                item.Gyms,
                                                item.Financials,
                                                item.Administration,
                                                item.Reports,
                                                item.Profile,
                                                item.Statements,
                                                Environment.NewLine );
                        }
                    }

                    #endregion

                    break;

                case "systemconfig":

                    #region System Config

                    csv = String.Format( "System Contact Email, Finance Contact Email, Password Change, Images Location, Documents Location, Contact Email, Finance Email, Address, Contact Number, Payment User Code, Payment Account, App Download URL, Payment Monitor Path, Payment Monitor Day, Payment Monitor Start, Last Payment Monitor Run, Last Payment Monitor Count, Payments Export Path, Statement Folder, Payment Folder, DR Discount {0}", Environment.NewLine );

                    List<SystemConfig> items = new List<SystemConfig>();

                    using ( SystemConfigService service = new SystemConfigService() )
                    {
                        items = service.List( pm, csm );
                    }

                    if ( items != null && items.Any() )
                    {
                        foreach ( SystemConfig item in items )
                        {
                            csv = String.Format( "{0} {1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12},{13},{14},{15},{16},{17},{18},{19},{20},{21} {22}",
                                                csv,
                                                item.ContactEmail,
                                                item.FinancialEmail,
                                                item.PasswordChange,
                                                item.ImagesLocation,
                                                item.DocumentsLocation,
                                                item.ContactEmail,
                                                item.FinancialEmail,
                                                item.Address,
                                                item.ContactNumber,
                                                item.PaymentUserCode,
                                                item.PaymentAccount,
                                                item.AppDownloadUrl,
                                                item.PaymentMonitorPath,
                                                item.PaymentMonitorDay,
                                                item.PaymentMonitorStart,
                                                item.LastPaymentMonitorRun,
                                                item.LastPaymentMonitorCount,
                                                item.PaymentsExportPath,
                                                item.StatementFolder,
                                                item.PaymentFolder,
                                                item.DRDiscount,
                                                Environment.NewLine );
                        }
                    }

                    #endregion

                    break;

                case "auditlog":

                    #region Audit Log

                    csv = string.Format( "Date, Activity, User, Action Table, Action, Controller, Comments, Image Before, Image After, Browser {0}", Environment.NewLine );

                    List<AuditLogCustomModel> auditModel = new List<AuditLogCustomModel>();

                    using ( AuditLogService service = new AuditLogService() )
                    {
                        auditModel = service.List( pm, csm );
                    }

                    if ( auditModel != null && auditModel.Any() )
                    {
                        foreach ( AuditLogCustomModel item in auditModel )
                        {
                            ActivityTypes activity = ( ActivityTypes ) item.Type;

                            csv = string.Format( "{0} {1},{2},{3},{4},{5},{6},{7},{8},{9},{10} {11}",
                                                csv,
                                                item.CreatedOn.ToString( "yyyy/MM/dd" ),
                                                activity.GetDisplayText(),
                                                item.User.Name + " " + item.User.Surname,
                                                item.ActionTable,
                                                item.Action,
                                                item.Controller,
                                                "\"" + item.Comments + "\"",
                                                "\"" + ( item.BeforeImage ?? "" ).Replace( '"', ' ' ) + "\"",
                                                "\"" + ( item.BeforeImage ?? "" ).Replace( '"', ' ' ) + "\"",
                                                "\"" + ( item.Browser ?? "" ) + "\"",
                                                Environment.NewLine );
                        }
                    }

                    #endregion

                    break;

                case "broadcasts":

                    #region BroadCasts

                    csv = String.Format( "Date Created, Start Date, End Date, Status, xRead, Message {0}", Environment.NewLine );

                    List<Broadcast> broadcasts = new List<Broadcast>();

                    using ( BroadcastService service = new BroadcastService() )
                    {
                        broadcasts = service.List( pm, csm );
                    }

                    if ( broadcasts != null && broadcasts.Any() )
                    {
                        foreach ( Broadcast item in broadcasts )
                        {
                            Status status = ( Status ) item.Status;

                            csv = String.Format( "{0} {1},{2},{3},{4},{5},{6} {7}",
                                                csv,
                                                item.CreatedOn,
                                                item.StartDate,
                                                item.EndDate,
                                                status.GetDisplayText(),
                                                item.UserBroadcasts.Count,
                                                item.Message,
                                                Environment.NewLine );
                        }
                    }

                    #endregion

                    break;

                case "users":

                    #region Manage Users

                    csv = string.Format( "Date Created, Name, ID No., Tax No., Status, Role, Email, Cell, Province, Town, Address Line1, Address Line2, Postal Code {0}", Environment.NewLine );

                    List<Address> addresses;
                    List<User> userModel = new List<User>();

                    using ( UserService uservice = new UserService() )
                    using ( AddressService aservice = new AddressService() )
                    {
                        userModel = uservice.List( pm, csm );

                        if ( userModel != null && userModel.Any() )
                        {
                            foreach ( User item in userModel )
                            {
                                Status status = ( Status ) item.Status;

                                Role role = new Role() { Name = "~/~", Type = -1 };

                                if ( item.UserRoles.Any() )
                                {
                                    role = item.UserRoles.FirstOrDefault().Role;
                                }

                                RoleType roleType = ( RoleType ) role.Type;

                                addresses = aservice.List( item.Id, "User" );

                                Address address = addresses?.FirstOrDefault();

                                csv = string.Format( "{0} {1},{2},{3},{4},{5},{6},{7},{8},{9}, {10}, {11}, {12}, {13} {14}", csv,
                                                    item.CreatedOn.ToString( "yyyy/MM/dd" ),
                                                    item.Name + " " + item.Surname,
                                                    item.IdNumber,
                                                    item.TaxNumber,
                                                    status.GetDisplayText(),
                                                    roleType.GetDisplayText(),
                                                    item.Email,
                                                    item.Cell,
                                                    ( address != null ) ? ( ( Province ) address.Province ).GetDisplayText() : "",
                                                    address?.Town,
                                                    address?.Addressline1,
                                                    address?.Addressline2,
                                                    address?.PostalCode,
                                                    Environment.NewLine );
                            }
                        }
                    }

                    #endregion

                    break;

                case "banks":

                    #region Banks

                    csv = string.Format( "Date Created, Name, Description, Code, Status {0}", Environment.NewLine );

                    List<Bank> banks = new List<Bank>();

                    using ( BankService service = new BankService() )
                    {
                        banks = service.List( pm, csm );
                    }

                    if ( banks != null && banks.Any() )
                    {
                        foreach ( Bank item in banks )
                        {
                            Status status = ( Status ) ( item.Status );

                            csv = string.Format( "{0} {1},{2},{3},{4},{5} {6}",
                                                csv,
                                                item.CreatedOn.ToString( "yyyy/MM/dd" ),
                                                item.Name,
                                                item.Description,
                                                item.Code,
                                                status.GetDisplayText(),
                                                Environment.NewLine );
                        }
                    }

                    #endregion

                    break;
            }

            return File( new System.Text.UTF8Encoding().GetBytes( csv ), "text/csv", filename );
        }

        #endregion



        #region Roles

        //
        // GET: /Administration/RoleDetails/5
        public ActionResult RoleDetails( int id, bool layout = true )
        {
            Role model = new Role();

            using ( RoleService service = new RoleService() )
            {
                model = service.GetById( id );
            }

            if ( model == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return RedirectToAction( "Index" );
            }

            if ( layout )
            {
                ViewBag.IncludeLayout = true;
            }

            return View( model );
        }

        //
        // GET: /Administration/AddRole/5 
        [Requires( PermissionTo.Create )]
        public ActionResult AddRole()
        {
            RoleViewModel model = new RoleViewModel() { EditMode = true };

            return View( model );
        }

        //
        // POST: /Administration/AddRole/5
        [HttpPost]
        [Requires( PermissionTo.Create )]
        public ActionResult AddRole( RoleViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the Role was not created. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            using ( RoleService rservice = new RoleService() )
            using ( TransactionScope scope = new TransactionScope() )
            {
                #region Validations

                //if ( rservice.ExistByNameType( model.Name?.Trim(), model.Type ) )
                //{
                //    // Role already exist!
                //    Notify( $"Sorry, a Role with the name \"{model.Name} ({model.Type.GetDisplayText()})\" already exists!", NotificationType.Error );

                //    return View( model );
                //}

                #endregion

                #region Create Role

                // Create Role
                Role role = new Role()
                {
                    Name = model.Name,
                    Reports = model.Reports,
                    Clients = model.Clients,
                    Profile = model.Profile,
                    Type = ( int ) model.Type,
                    Services = model.Services,
                    DashBoard = model.DashBoard,
                    Financials = model.Financials,
                    Statements = model.Statements,
                    Administration = model.Administration
                };

                rservice.Create( role );

                #endregion

                // We're done here..

                scope.Complete();
            }

            Notify( "The Role was successfully created.", NotificationType.Success );

            return RedirectToAction( "Roles" );
        }

        //
        // GET: /Administration/EditRole/5
        [Requires( PermissionTo.Edit )]
        public ActionResult EditRole( int id )
        {
            Role role;

            using ( RoleService service = new RoleService() )
            {
                role = service.GetById( id );
            }

            if ( role == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return PartialView( "_AccessDenied" );
            }

            RoleViewModel model = new RoleViewModel()
            {
                Id = role.Id,
                Name = role.Name,
                Reports = role.Reports,
                Clients = role.Clients,
                Profile = role.Profile,
                Services = role.Services,
                Gyms = role.Gyms,
                Members = role.Members,
                DashBoard = role.DashBoard,
                Statements = role.Statements,
                Financials = role.Financials,
                Type = ( RoleType ) role.Type,
                Administration = role.Administration,
                EditMode = true
            };

            return View( model );
        }

        //
        // POST: /Administration/EditRole/5
        [HttpPost]
        [Requires( PermissionTo.Edit )]
        public ActionResult EditRole( RoleViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the selected Role was not updated. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            Role role;

            using ( RoleService rservice = new RoleService() )
            using ( TransactionScope scope = new TransactionScope() )
            {
                role = rservice.GetById( model.Id );

                if ( role == null )
                {
                    Notify( "Sorry, that Role does not exist! Please specify a valid Role Id and try again.", NotificationType.Error );

                    return View( model );
                }

                #region Validations

                //if ( ( !role.Name.Trim().Equals( model.Name ) || role.Type != ( int ) model.Type ) && rservice.ExistByNameType( model.Name?.Trim(), model.Type ) )
                //{
                //    // Role already exist!
                //    Notify( $"Sorry, a Role with the ID Number \"{model.Name} ({model.Type.GetDisplayText()})\" already exists!", NotificationType.Error );

                //    return View( model );
                //}

                #endregion

                #region Update Role

                // Update Role
                role.Name = model.Name;
                role.Reports = model.Reports;
                role.Clients = model.Clients;
                role.Profile = model.Profile;
                role.Type = ( int ) model.Type;
                role.Services = model.Services;
                role.DashBoard = model.DashBoard;
                role.Statements = model.Statements;
                role.Financials = model.Financials;
                role.Administration = model.Administration;

                rservice.Update( role );

                #endregion

                scope.Complete();
            }

            Notify( "The selected Role details were successfully updated.", NotificationType.Success );

            return RedirectToAction( "Roles" );
        }

        #endregion



        #region System Config

        //
        // GET: /Administration/EditSystemConfig/5
        [Requires( PermissionTo.Edit )]
        public ActionResult EditSystemConfig( int id )
        {
            SystemConfig config = new SystemConfig();

            using ( SystemConfigService service = new SystemConfigService() )
            {
                config = service.GetById( id );
            }

            if ( config == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return PartialView( "_AccessDenied" );
            }

            SystemConfigViewModel model = new SystemConfigViewModel()
            {
                Id = config.Id,
                ImagesLocation = config.ImagesLocation,
                DocumentsLocation = config.DocumentsLocation,
                PasswordChange = config.PasswordChange,
                ContactEmail = config.ContactEmail,
                FinancialEmail = config.FinancialEmail,
                ContactNumber = config.ContactNumber,
                Address = config.Address,
                PaymentAccount = config.PaymentAccount,
                PaymentUserCode = config.PaymentUserCode,
                AppDownloadUrl = config.AppDownloadUrl,
                DRDiscount = config.DRDiscount,

                PaymentMonitorPath = config.PaymentMonitorPath,
                PaymentMonitorStart = config.PaymentMonitorStart,
                PaymentMonitorDay = config.PaymentMonitorDay,

                PaymentsExportPath = config.PaymentsExportPath,
                StatementFolder = config.StatementFolder,
                PaymentFolder = config.PaymentFolder
            };

            return View( model );
        }

        //
        // POST: /Administration/EditSystemConfig/5
        [HttpPost]
        [Requires( PermissionTo.Edit )]
        public ActionResult EditSystemConfig( SystemConfigViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the selected Config was not updated. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            SystemConfig config;

            using ( SystemConfigService service = new SystemConfigService() )
            {
                config = service.GetById( model.Id );

                if ( config == null )
                {
                    Notify( "Sorry, that Config does not exist! Please specify a valid Config Id and try again.", NotificationType.Error );

                    return View( model );
                }

                config.ImagesLocation = model.ImagesLocation;
                config.DocumentsLocation = model.DocumentsLocation;
                config.PasswordChange = model.PasswordChange;
                config.ContactEmail = model.ContactEmail;
                config.FinancialEmail = model.FinancialEmail;
                config.ContactNumber = model.ContactNumber;
                config.Address = model.Address;
                config.PaymentAccount = model.PaymentAccount;
                config.PaymentUserCode = model.PaymentUserCode;
                config.AppDownloadUrl = model.AppDownloadUrl;
                config.DRDiscount = model.DRDiscount;

                config.PaymentMonitorPath = model.PaymentMonitorPath;
                config.PaymentMonitorStart = model.PaymentMonitorStart;
                config.PaymentMonitorDay = model.PaymentMonitorDay;

                config.PaymentsExportPath = model.PaymentsExportPath;
                config.StatementFolder = model.StatementFolder;
                config.PaymentFolder = model.PaymentFolder;

                service.Update( config );
            }

            Notify( "The System Configuration details were successfully updated.", NotificationType.Success );

            VariableExtension.SystemRules = null;
            ContextExtensions.RemoveCachedData( "SR_ca" );

            return RedirectToAction( "SystemConfig" );
        }

        #endregion



        #region Audit Log Managements

        //
        // GET: /Administration/AuditLogDetails/5
        public ActionResult AuditLogDetails( int id, bool layout = true )
        {
            AuditLogCustomModel model = new AuditLogCustomModel();

            using ( AuditLogService service = new AuditLogService() )
            {
                model = service.GetById( id );
            }

            if ( model == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return RedirectToAction( "Index" );
            }

            if ( layout )
            {
                ViewBag.IncludeLayout = true;
            }

            return View( model );
        }

        #endregion



        #region User Management

        //
        // GET: /Administration/UserDetails/5
        public ActionResult UserDetails( int id, bool layout = true )
        {
            User model;

            List<Image> images;
            List<Address> addresses;
            List<Document> documents;
            List<BankDetail> bankDetails;

            using ( UserService service = new UserService() )
            {
                model = service.GetById( id );
            }

            if ( model == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return RedirectToAction( "Index" );
            }

            using ( ImageService iservice = new ImageService() )
            using ( AddressService aservice = new AddressService() )
            using ( DocumentService dservice = new DocumentService() )
            using ( BankDetailService bservice = new BankDetailService() )
            {
                addresses = aservice.List( model.Id, "User" );
                images = iservice.List( model.Id, "User" );
                documents = dservice.List( model.Id, "User" );
                bankDetails = bservice.List( model.Id, "User" );
            }

            ViewBag.Images = images;
            ViewBag.Addresses = addresses;
            ViewBag.Documents = documents;
            ViewBag.BankDetails = bankDetails;

            if ( layout )
            {
                ViewBag.IncludeLayout = true;
            }

            return View( model );
        }

        //
        // GET: /Administration/AddUser/5 
        [Requires( PermissionTo.Create )]
        public ActionResult AddUser()
        {
            UserViewModel model = new UserViewModel() { EditMode = true, IsSAId = true };

            return View( model );
        }

        //
        // POST: /Administration/AddUser/5
        [HttpPost]
        [Requires( PermissionTo.Create )]
        public ActionResult AddUser( UserViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the User was not created. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            User user;

            using ( UserService uservice = new UserService() )
            using ( RoleService rservice = new RoleService() )
            using ( AddressService aservice = new AddressService() )
            using ( TransactionScope scope = new TransactionScope() )
            {
                #region Validations

                if ( uservice.ExistByIdNumber( model.IdNumber?.Trim() ) )
                {
                    // User already exist!
                    Notify( string.Format( "Sorry, a User with the ID Number \"{0}\" already exists!", model.IdNumber ), NotificationType.Error );

                    return View( model );
                }
                if ( uservice.ExistByEmail( model.Email?.Trim() ) )
                {
                    // User already exist!
                    Notify( string.Format( "Sorry, a User with the Email Address \"{0}\" already exists!", model.Email ), NotificationType.Error );

                    return View( model );
                }
                if ( uservice.ExistByTaxNumber( model.TaxNumber?.Trim() ) )
                {
                    // User already exist!
                    Notify( string.Format( "Sorry, a User with the Tax Number \"{0}\" already exists!", model.TaxNumber ), NotificationType.Error );

                    return View( model );
                }
                if ( !string.Equals( model.Password?.Trim(), model.ConfirmPassword?.Trim() ) )
                {
                    // Password mismatch
                    Notify( "Password combination does not match. Please try again.", NotificationType.Error );

                    return View( model );
                }

                #endregion


                #region Create User

                Role role = rservice.GetById( model.RoleId );

                // Create User
                user = new User()
                {
                    Reset = false,
                    //Type = role.Type,
                    Cell = model.Cell,
                    Name = model.Name,
                    Email = model.Email,
                    Surname = model.Surname,
                    IdNumber = model.IdNumber,
                    TaxNumber = model.TaxNumber,
                    PasswordDate = DateTime.Now,
                    Status = ( int ) model.Status,
                    DateOfBirth = model.DateOfBirth,
                    Password = uservice.GetSha1Md5String( model.Password )
                };

                user = uservice.Create( user, model.RoleId );

                #endregion


                #region Create Address (s)

                // Create Address (s)
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

                // We're done here..

                scope.Complete();
            }

            Notify( "The User was successfully created.", NotificationType.Success );

            return RedirectToAction( "Users" );
        }

        //
        // GET: /Administration/EditUser/5
        [Requires( PermissionTo.Edit )]
        public ActionResult EditUser( int id )
        {
            User user;
            List<Address> addresses;

            using ( UserService service = new UserService() )
            {
                user = service.GetById( id );
            }

            if ( user == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return PartialView( "_AccessDenied" );
            }

            using ( AddressService service = new AddressService() )
            {
                addresses = service.List( user.Id, "User" );
            }

            Role role = null;

            if ( user.UserRoles.Any() )
            {
                role = user.UserRoles.FirstOrDefault().Role;
            }

            UserViewModel model = new UserViewModel()
            {
                Id = user.Id,
                Name = user.Name?.Trim(),
                Surname = user.Surname?.Trim(),
                IdNumber = user.IdNumber?.Trim(),
                Email = user.Email?.Trim(),
                Cell = user.Cell?.Trim(),
                Status = ( Status ) user.Status,
                RoleId = role.Id,
                Role = role,
                DateOfBirth = user.DateOfBirth.Value,
                TaxNumber = user.TaxNumber,
                IsSAId = !string.IsNullOrEmpty( user.IdNumber?.Trim() ),
                EditMode = true
            };

            model.Addresses = new List<AddressViewModel>();

            if ( addresses != null && addresses.NullableAny() )
            {
                foreach ( Address a in addresses )
                {
                    model.Addresses.Add( new AddressViewModel()
                    {
                        Id = a.Id,
                        Town = a.Town,
                        EditMode = true,
                        ObjectId = a.ObjectId,
                        PostalCode = a.PostalCode,
                        Status = ( Status ) a.Status,
                        AddressLine1 = a.Addressline1,
                        AddressLine2 = a.Addressline2,
                        Province = ( Province ) a.Province,
                        AddressType = ( AddressType ) a.Type
                    } );
                }
            }

            return View( model );
        }

        //
        // POST: /Administration/EditUser/5
        [HttpPost]
        [Requires( PermissionTo.Edit )]
        public ActionResult EditUser( UserViewModel model, PagingModel pm )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the selected User was not updated. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            User user;

            using ( UserService uservice = new UserService() )
            using ( RoleService rservice = new RoleService() )
            using ( AddressService aservice = new AddressService() )
            using ( TransactionScope scope = new TransactionScope() )
            {
                user = uservice.GetById( model.Id );

                if ( user == null )
                {
                    Notify( "Sorry, that User does not exist! Please specify a valid User Id and try again.", NotificationType.Error );

                    return View( model );
                }

                #region Validations

                if ( !( user.IdNumber ?? "" ).Trim().Equals( model.IdNumber ) && uservice.ExistByIdNumber( model.IdNumber?.Trim() ) )
                {
                    // User already exist!
                    Notify( string.Format( "Sorry, a User with the ID Number \"{0}\" already exists!", model.IdNumber ), NotificationType.Error );

                    return View( model );
                }
                if ( !( user.Email ?? "" ).Trim().Equals( model.Email ) && uservice.ExistByEmail( model.Email?.Trim() ) )
                {
                    // User already exist!
                    Notify( string.Format( "Sorry, a User with the Email Address \"{0}\" already exists!", model.Email ), NotificationType.Error );

                    return View( model );
                }
                if ( !( user.TaxNumber ?? "" ).Trim().Equals( model.TaxNumber ) && uservice.ExistByTaxNumber( model.TaxNumber?.Trim() ) )
                {
                    // User already exist!
                    Notify( string.Format( "Sorry, a User with the Tax Number \"{0}\" already exists!", model.TaxNumber ), NotificationType.Error );

                    return View( model );
                }

                if ( !string.IsNullOrEmpty( model.Password ) && !string.Equals( model.Password?.Trim(), model.ConfirmPassword?.Trim() ) )
                {
                    // Password mismatch
                    Notify( "Password combination does not match. Please try again.", NotificationType.Error );

                    return View( model );
                }

                #endregion


                #region Update User

                Role role = rservice.GetById( model.RoleId );

                // Update User
                //user.Type = role.Type;
                user.Cell = model.Cell;
                user.Name = model.Name;
                user.Email = model.Email;
                user.Surname = model.Surname;
                user.IdNumber = model.IdNumber;
                user.TaxNumber = model.TaxNumber;
                user.Status = ( int ) model.Status;
                user.DateOfBirth = model.DateOfBirth;

                if ( !string.IsNullOrEmpty( model.Password ) )
                {
                    user.PasswordDate = DateTime.Now;
                    user.Password = uservice.GetSha1Md5String( model.Password );
                }

                user = uservice.Update( user, model.RoleId );

                #endregion


                #region Update Address (s)

                if ( model.Addresses != null && model.Addresses.NullableAny() )
                {
                    foreach ( AddressViewModel a in model.Addresses )
                    {
                        if ( a.Id > 0 )
                        {
                            Address address = aservice.GetById( a.Id );

                            address.Town = a.Town;
                            address.PostalCode = a.PostalCode;
                            address.Type = ( int ) a.AddressType;
                            address.Addressline1 = a.AddressLine1;
                            address.Addressline2 = a.AddressLine2;
                            address.Province = ( int ) a.Province;

                            aservice.Update( address );
                        }
                        else
                        {
                            Address address = new Address()
                            {
                                Town = a.Town,
                                ObjectId = user.Id,
                                ObjectType = "User",
                                PostalCode = a.PostalCode,
                                Type = ( int ) a.AddressType,
                                Addressline1 = a.AddressLine1,
                                Addressline2 = a.AddressLine2,
                                Province = ( int ) a.Province,
                                Status = ( int ) Status.Active
                            };

                            aservice.Create( address );
                        }
                    }
                }


                #endregion


                scope.Complete();
            }

            Notify( "The selected User's details were successfully updated.", NotificationType.Success );

            return RedirectToAction( "Users" );
        }

        //
        // POST: /Administration/DeleteUser/5
        [HttpPost]
        [Requires( PermissionTo.Delete )]
        public ActionResult DeleteUser( UserViewModel model, PagingModel pm )
        {
            User user = new User();

            using ( UserService service = new UserService() )
            {
                user = service.GetById( model.Id );

                if ( user == null )
                {
                    Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                    return PartialView( "_AccessDenied" );
                }

                user.Status = ( ( ( Status ) user.Status ) == Status.Active ) ? ( int ) Status.Inactive : ( int ) Status.Active;

                service.Update( user );

                Notify( "The selected User was successfully updated.", NotificationType.Success );
            }

            return RedirectToAction( "Users" );
        }

        #endregion



        #region Broadcasts

        //
        // GET: /Administration/BroadcastDetails/5
        public ActionResult BroadcastDetails( int id, bool layout = true )
        {
            Broadcast model = new Broadcast();

            using ( BroadcastService service = new BroadcastService() )
            {
                model = service.GetById( id );
            }

            if ( model == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return RedirectToAction( "Index" );
            }

            if ( layout )
            {
                ViewBag.IncludeLayout = true;
            }

            return View( model );
        }

        //
        // GET: /Administration/AddBroadcast
        [Requires( PermissionTo.Create )]
        public ActionResult AddBroadcast()
        {
            BroadcastViewModel model = new BroadcastViewModel() { EditMode = true };

            return View( model );
        }

        //
        // POST: /Administration/AddBroadcast/5
        [HttpPost]
        [Requires( PermissionTo.Create )]
        public ActionResult AddBroadcast( BroadcastViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the Broadcast was not created. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            using ( BroadcastService service = new BroadcastService() )
            {
                if ( service.Exist( model.StartDate.Value ) )
                {
                    // Broadcast already exist!
                    Notify( string.Format( "Sorry, a Broadcast for/within the specified period \"{0}\" already exists!", model.StartDate ), NotificationType.Error );

                    return View( model );
                }

                Broadcast broadcast = new Broadcast()
                {
                    Message = model.Message,
                    EndDate = model.EndDate,
                    StartDate = model.StartDate.Value,
                    Status = ( int ) model.Status
                };

                broadcast = service.Create( broadcast );

                Notify( "The selected Broadcast were successfully created.", NotificationType.Success );
            }

            return RedirectToAction( "Broadcasts" );
        }

        //
        // GET: /Administration/EditBroadcast/5
        [Requires( PermissionTo.Edit )]
        public ActionResult EditBroadcast( int id )
        {
            Broadcast broadcast = new Broadcast();

            using ( BroadcastService service = new BroadcastService() )
            {
                broadcast = service.GetById( id );
            }

            if ( broadcast == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return PartialView( "_AccessDenied" );
            }

            BroadcastViewModel model = new BroadcastViewModel()
            {
                Id = broadcast.Id,
                StartDate = broadcast.StartDate,
                EndDate = broadcast.EndDate,
                Message = broadcast.Message,
                Status = ( Status ) broadcast.Status,
                EditMode = true
            };

            return View( model );
        }

        //
        // POST: /Administration/EditBroadcast/5
        [HttpPost]
        [Requires( PermissionTo.Edit )]
        public ActionResult EditBroadcast( BroadcastViewModel model, PagingModel pm )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the selected Broadcast was not updated. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            Broadcast broadcast = new Broadcast();

            using ( BroadcastService service = new BroadcastService() )
            {
                broadcast = service.GetById( model.Id );

                if ( broadcast == null )
                {
                    Notify( "Sorry, that Broadcast does not exist! Please specify a valid Broadcast Id and try again.", NotificationType.Error );

                    return View( model );
                }

                if ( !broadcast.Message.ToLower().Equals( model.Message.ToLower() ) && broadcast.StartDate.Date != model.StartDate.Value.Date && service.Exist( model.StartDate.Value ) )
                {
                    // Broadcast already exist!
                    Notify( string.Format( "Sorry, a Broadcast for/within the specified period \"{0}\" already exists!", model.StartDate ), NotificationType.Error );

                    return View( model );
                }

                broadcast.StartDate = model.StartDate.Value;
                broadcast.EndDate = model.EndDate;
                broadcast.Message = model.Message;
                broadcast.Status = ( int ) model.Status;

                broadcast = service.Update( broadcast );

                Notify( "The selected Broadcast's details were successfully updated.", NotificationType.Success );
            }

            return RedirectToAction( "Broadcasts" );
        }

        //
        // POST: /Administration/DeleteBroadcast/5
        [HttpPost]
        [Requires( PermissionTo.Delete )]
        public ActionResult DeleteBroadcast( BroadcastViewModel model )
        {
            Broadcast broadcast;

            using ( BroadcastService service = new BroadcastService() )
            {
                broadcast = service.GetById( model.Id );

                if ( broadcast == null )
                {
                    Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                    return PartialView( "_Notification" );
                }

                broadcast.Status = ( broadcast.Status == ( int ) Status.Active ) ? ( int ) Status.Inactive : ( int ) Status.Active;

                service.Update( broadcast );

                Notify( "The selected Broadcast was successfully updated.", NotificationType.Success );
            }

            return RedirectToAction( "Broadcasts" );
        }

        #endregion



        #region Banks

        //
        // GET: /Administration/BankDetails/5
        public ActionResult BankDetails( int id, bool layout = true )
        {
            Bank model = new Bank();

            using ( BankService service = new BankService() )
            {
                model = service.GetById( id );
            }

            if ( model == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return RedirectToAction( "Index" );
            }

            if ( layout )
            {
                ViewBag.IncludeLayout = true;
            }

            return View( model );
        }

        //
        // GET: /Administration/AddBank/5 
        [Requires( PermissionTo.Create )]
        public ActionResult AddBank()
        {
            BankViewModel model = new BankViewModel() { EditMode = true };

            return View( model );
        }

        //
        // POST: /Administration/AddBank/5
        [HttpPost]
        [Requires( PermissionTo.Create )]
        public ActionResult AddBank( BankViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the Bank was not created. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            Bank bank = new Bank();

            using ( BankService service = new BankService() )
            {
                if ( service.Exist( model.Name ) )
                {
                    // Bank already exist!
                    Notify( $"Sorry, a Bank with the Name \"{model.Name}\" already exists!", NotificationType.Error );

                    return View( model );
                }

                bank.Name = model.Name;
                bank.Description = model.Description;
                bank.Code = model.Code;
                bank.Status = ( int ) model.Status;

                bank = service.Create( bank );

                Notify( "The Bank was successfully created.", NotificationType.Success );
            }

            return RedirectToAction( "Banks" );
        }

        //
        // GET: /Administration/EditBank/5
        [Requires( PermissionTo.Edit )]
        public ActionResult EditBank( int id )
        {
            Bank bank = new Bank();

            using ( BankService service = new BankService() )
            {
                bank = service.GetById( id );
            }

            if ( bank == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return PartialView( "_AccessDenied" );
            }

            BankViewModel model = new BankViewModel()
            {
                Id = bank.Id,
                Name = bank.Name,
                Description = bank.Description,
                Code = bank.Code,
                Status = ( Status ) bank.Status,
                EditMode = true
            };

            return View( model );
        }

        //
        // POST: /Administration/EditBank/5
        [HttpPost]
        [Requires( PermissionTo.Edit )]
        public ActionResult EditBank( BankViewModel model, PagingModel pm )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the selected Bank was not updated. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            Bank bank = new Bank();

            using ( BankService service = new BankService() )
            {
                bank = service.GetById( model.Id );

                if ( bank == null )
                {
                    Notify( "Sorry, that Bank does not exist! Please specify a valid Bank Id and try again.", NotificationType.Error );

                    return View( model );
                }

                if ( !bank.Name.Equals( model.Name ) && service.Exist( model.Name ) )
                {
                    // Bank already exist!
                    Notify( $"Sorry, a Bank with the Name \"{model.Name}\" already exists!", NotificationType.Error );

                    return View( model );
                }

                bank.Name = model.Name;
                bank.Description = model.Description;
                bank.Code = model.Code;
                bank.Status = ( int ) model.Status;

                bank = service.Update( bank );

                Notify( "The selected Bank's details were successfully updated.", NotificationType.Success );
            }

            return RedirectToAction( "Banks" );
        }

        //
        // POST: /Administration/DeleteBank/5
        [HttpPost]
        [Requires( PermissionTo.Delete )]
        public ActionResult DeleteBank( BankViewModel model, PagingModel pm )
        {
            Bank bank = new Bank();

            using ( BankService service = new BankService() )
            {
                bank = service.GetById( model.Id );

                if ( bank == null )
                {
                    Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                    return PartialView( "_AccessDenied" );
                }

                bank.Status = ( ( ( Status ) bank.Status ) == Status.Active ) ? ( int ) Status.Inactive : ( int ) Status.Active;

                service.Update( bank );

                Notify( "The selected Bank was successfully updated.", NotificationType.Success );
            }

            return RedirectToAction( "Banks" );
        }

        #endregion



        #region Partial Views

        //
        // POST || GET: /Administration/Roles
        public ActionResult Roles( PagingModel pm, CustomSearchModel csm )
        {
            int total = 0;

            List<Role> model = new List<Role>();

            using ( RoleService service = new RoleService() )
            {
                pm.Sort = pm.Sort ?? "DESC";
                pm.SortBy = pm.SortBy ?? "CreatedOn";

                model = service.List( pm, csm );
                total = ( model.Count < pm.Take && pm.Skip == 0 ) ? model.Count : service.Total( pm, csm );
            }

            PagingExtension paging = PagingExtension.Create( model, total, pm.Skip, pm.Take, pm.Page );

            return PartialView( "_Roles", paging );
        }


        //
        // POST || GET: /Administration/SystemConfig
        public ActionResult SystemConfig( PagingModel pm, CustomSearchModel csm )
        {
            SystemConfig model;

            using ( SystemConfigService service = new SystemConfigService() )
            {
                model = service.List( pm, csm ).FirstOrDefault() ?? new SystemConfig() { };
            }

            return PartialView( "_SystemConfig", model );
        }


        //
        // POST || GET: /Administration/AuditLog
        public ActionResult AuditLog( PagingModel pm, CustomSearchModel csm, bool givecsm = false )
        {
            if ( givecsm )
            {
                ViewBag.ViewName = "_AuditLog";
                return PartialView( "_AuditLogCustomSearch", new CustomSearchModel( "AuditLog" ) );
            }

            int total = 0;

            List<AuditLogCustomModel> model = new List<AuditLogCustomModel>();

            using ( AuditLogService service = new AuditLogService() )
            {
                pm.Sort = pm.Sort ?? "DESC";
                pm.SortBy = pm.SortBy ?? "CreatedOn";

                model = service.List( pm, csm );
                total = ( model.Count < pm.Take && pm.Skip == 0 ) ? model.Count : service.Total( pm, csm );
            }

            PagingExtension paging = PagingExtension.Create( model, total, pm.Skip, pm.Take, pm.Page );

            return PartialView( "_AuditLog", paging );
        }


        //
        // POST || GET: /Administration/Users
        public ActionResult Users( PagingModel pm, CustomSearchModel csm, bool givecsm = false )
        {
            if ( givecsm )
            {
                ViewBag.ViewName = "Users";
                return PartialView( "_UsersCustomSearch", new CustomSearchModel( "Users" ) );
            }

            int total = 0;

            List<User> model = new List<User>();

            using ( UserService service = new UserService() )
            {
                model = service.List( pm, csm );
                total = ( model.Count < pm.Take && pm.Skip == 0 ) ? model.Count : service.Total( pm, csm );
            }

            PagingExtension paging = PagingExtension.Create( model, total, pm.Skip, pm.Take, pm.Page );

            return PartialView( "_Users", paging );
        }


        //
        // POST || GET: /Administration/Broadcasts
        public ActionResult Broadcasts( PagingModel pm, CustomSearchModel csm )
        {
            pm.Take = int.MaxValue;

            pm.Sort = "DESC";
            pm.SortBy = "CreatedOn";

            int total = 0;

            List<Broadcast> model = new List<Broadcast>();

            using ( BroadcastService service = new BroadcastService() )
            {
                model = service.List( pm, csm );
                total = ( model.Count < pm.Take && pm.Skip == 0 ) ? model.Count : service.Total( pm, csm );
            }

            PagingExtension paging = PagingExtension.Create( model, total, pm.Skip, pm.Take, pm.Page );

            return PartialView( "_Broadcasts", paging );
        }


        //
        // POST || GET: /Administration/Banks
        public ActionResult Banks( PagingModel pm, CustomSearchModel csm )
        {
            int total = 0;

            List<Bank> model = new List<Bank>();

            using ( BankService service = new BankService() )
            {
                model = service.List( pm, csm );
                total = ( model.Count < pm.Take && pm.Skip == 0 ) ? model.Count : service.Total( pm, csm );
            }

            PagingExtension paging = PagingExtension.Create( ( object ) model, total, pm.Skip, pm.Take, pm.Page );

            return PartialView( "_Banks", paging );
        }

        #endregion
    }
}
