using NedShape.Core.Enums;
using NedShape.Core.Models;
using NedShape.Core.Services;
using NedShape.Data.Models;
using NedShape.UI.Models;
using NedShape.UI.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;

namespace NedShape.UI.Controllers
{
    [Requires( PermissionTo.View, PermissionContext.Gyms )]
    public class GymController : BaseController
    {
        // GET: Gyms
        public ActionResult Index()
        {
            return View();
        }


        // GET: /Gyms/Details/5
        public ActionResult Details( int id, bool layout = true )
        {
            Gym model;

            List<Image> images;
            List<Address> addresses;
            List<Document> documents;
            List<BankDetail> bankDetails;

            using ( Core.Services.GymService service = new Core.Services.GymService() )
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
                images = iservice.List( model.Id, "Gym" );
                addresses = aservice.List( model.Id, "Gym" );
                documents = dservice.List( model.Id, "Gym" );
                bankDetails = bservice.List( model.Id, "Gym" );
            }

            ViewBag.Images = images;
            ViewBag.Addresses = addresses;
            ViewBag.Documents = documents;

            if ( layout )
            {
                ViewBag.IncludeLayout = true;
            }

            return View( model );
        }

        //
        // GET: /Gyms/Add/5 
        [Requires( PermissionTo.Create )]
        public ActionResult Add()
        {
            GymViewModel model = new GymViewModel() { EditMode = true };

            return View( model );
        }

        //
        // POST: /Gyms/Add/5
        [HttpPost]
        [Requires( PermissionTo.Create )]
        public ActionResult Add( GymViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the Gym was not created. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            using ( ImageService iservice = new ImageService() )
            using ( AddressService aservice = new AddressService() )
            using ( TransactionScope scope = new TransactionScope() )
            using ( GymTimeService gtservice = new GymTimeService() )
            using ( DocumentService dservice = new DocumentService() )
            using ( BankDetailService bservice = new BankDetailService() )
            using ( GymServiceService gsservice = new GymServiceService() )
            using ( Core.Services.GymService gservice = new Core.Services.GymService() )
            {
                #region Validations

                if ( gservice.ExistByTradingNameAndRegNo( model.TradingName.Trim(), model.RegNo.Trim() ) )
                {
                    // Gym already exist!
                    Notify( $"Sorry, a Gym with the Trading Name \"{model.TradingName}\" and Reg # \"{model.RegNo}\" already exists!", NotificationType.Error );

                    return View( model );
                }

                #endregion


                #region Create Gym

                string uid = gservice.GetSha1Md5String( $"{DateTime.Now}" ).Substring( 0, 10 );

                // Create Gym
                Gym gym = new Gym()
                {
                    Fax = model.Fax,
                    Name = model.Name,
                    VATNo = model.VATNo,
                    RegNo = model.RegNo,
                    Website = model.Website,
                    Cell = model.ContactCell,
                    StatusDate = DateTime.Now,
                    Reference = uid.ToUpper(),
                    POPEmail = model.POPEmail,
                    Email = model.ContactEmail,
                    Status = ( int ) model.Status,
                    ContactTel = model.ContactTel,
                    TradingName = model.TradingName,
                    ContactCell = model.ContactCell,
                    CompanyEmail = model.CompanyEmail,
                    ContactEmail = model.ContactEmail,
                    ContactPerson = model.ContactPerson,
                    Approved = model.Approved == YesNo.Yes ? true : false,
                    ApprovedBy = model.Approved == YesNo.Yes ? CurrentUser.Id : ( int? ) null,
                    ApprovedOn = model.Approved == YesNo.Yes ? DateTime.Now : ( DateTime? ) null,
                    ApproverComments = model.Approved == YesNo.Yes ? model.ApproverComment : null
                };

                gym = gservice.Create( gym );

                #endregion


                #region Gym Services

                if ( model.Services != null && model.Services.NullableAny() )
                {
                    foreach ( ServiceViewModel s in model.Services )
                    {
                        Data.Models.GymService gs = new Data.Models.GymService()
                        {
                            GymId = gym.Id,
                            ServiceId = s.Id,
                            Fee = s.Price ?? 0,
                            Description = s.Description,
                            Status = ( int ) Status.Active
                        };

                        gs = gsservice.Create( gs );

                        if ( s.GymTime != null )
                        {
                            GymTime gt = new GymTime();

                            gt = SetGymeTime( s.GymTime, gt, gs.Id );

                            gtservice.Create( gt );
                        }
                    }
                }

                #endregion


                #region Create Address (s)

                if ( model.Addresses != null && model.Addresses.NullableAny() )
                {
                    foreach ( AddressViewModel a in model.Addresses )
                    {
                        Address address = new Address()
                        {
                            ObjectId = gym.Id,
                            ObjectType = "Gym",
                            Addressline1 = a.AddressLine1,
                            Addressline2 = a.AddressLine2,
                            Town = a.Town,
                            PostalCode = a.PostalCode,
                            Province = ( int ) a.Province,
                            Type = ( int ) a.AddressType,
                            Status = ( int ) Status.Active,
                            Latitude = a.Latitude,
                            Longitude = a.Longitude
                        };

                        aservice.Create( address );
                    }
                }

                #endregion


                #region Create Bank Details

                if ( model.BankDetails != null && model.BankDetails.NullableAny( b => b.BankId > 0 ) )
                {
                    foreach ( BankDetailViewModel b in model.BankDetails )
                    {
                        if ( b.BankId <= 0 ) continue;

                        BankDetail bank = new BankDetail()
                        {
                            ObjectId = gym.Id,
                            ObjectType = "Gym",
                            BankId = b.BankId,
                            Beneficiary = b.Beneficiary,
                            Account = b.Account,
                            Branch = b.Branch,
                            AccountType = ( int ) b.AccountType,
                            Status = ( int ) Status.Active
                        };

                        bservice.Create( bank );
                    }
                }

                #endregion


                #region Any Uploads

                if ( model.Files != null && model.Files.Any( f => f.File != null ) )
                {
                    // Create folder
                    string path = Server.MapPath( $"~/{VariableExtension.SystemRules.ImagesLocation}/Gyms/{gym.Reference}/" );

                    if ( !Directory.Exists( path ) )
                    {
                        Directory.CreateDirectory( path );
                    }

                    string now = DateTime.Now.ToString( "yyyyMMddHHmmss" );

                    foreach ( FileViewModel f in model.Files.Where( f => f.File != null ) )
                    {
                        if ( f.Name.ToLower() == "logo" )
                        {
                            Image image = new Image()
                            {
                                Name = f.Name,
                                ObjectId = gym.Id,
                                ObjectType = "Gym",
                                Size = f.File.ContentLength,
                                Description = f.Description,
                                IsMain = ( f.Name.ToLower() == "logo" ),
                                Extension = Path.GetExtension( f.File.FileName ),
                                Location = $"Gyms/{gym.Reference}/{now}-{f.File.FileName}"
                            };

                            iservice.Create( image );
                        }
                        else
                        {
                            Document doc = new Document()
                            {
                                Name = f.Name,
                                Category = f.Name,
                                ObjectId = gym.Id,
                                ObjectType = "Gym",
                                Url = f.ExternalUrl,
                                Description = f.Description,
                                Size = f.File.ContentLength,
                                Status = ( int ) Status.Active,
                                Title = Path.GetExtension( f.File.FileName ),
                                Type = Path.GetExtension( f.File.FileName ),
                                Location = $"Gyms/{gym.Reference}/{now}-{f.File.FileName}",
                            };

                            dservice.Create( doc );
                        }

                        string fullpath = Path.Combine( path, $"{now}-{f.File.FileName}" );

                        f.File.SaveAs( fullpath );
                    }
                }

                #endregion

                // We're done here..

                scope.Complete();
            }

            Notify( "The Gym was successfully created.", NotificationType.Success );

            return RedirectToAction( "Gyms" );
        }

        public GymTime SetGymeTime( GymTimeViewModel gtv, GymTime gt, int gymServiceId )
        {
            gt.GymServiceId = gymServiceId;

            // Open
            gt.OpenOnMonday = gtv.OpenOnMonday == YesNo.Yes ? true : false;
            gt.OpenOnTuesday = gtv.OpenOnTuesday == YesNo.Yes ? true : false;
            gt.OpenOnWednesday = gtv.OpenOnWednesday == YesNo.Yes ? true : false;
            gt.OpenOnThursday = gtv.OpenOnThursday == YesNo.Yes ? true : false;
            gt.OpenOnFriday = gtv.OpenOnFriday == YesNo.Yes ? true : false;
            gt.OpenOnSaturday = gtv.OpenOnSaturday == YesNo.Yes ? true : false;
            gt.OpenOnSunday = gtv.OpenOnSunday == YesNo.Yes ? true : false;
            gt.OpenOnPublicHoliday = gtv.OpenOnPublicHoliday == YesNo.Yes ? true : false;

            // Start
            gt.MondayStart = gtv.MondayStart;
            gt.TuesdayStart = gtv.TuesdayStart;
            gt.WednesdayStart = gtv.WednesdayStart;
            gt.ThursdayStart = gtv.ThursdayStart;
            gt.FridayStart = gtv.FridayStart;
            gt.SaturdayStart = gtv.SaturdayStart;
            gt.SundayStart = gtv.SundayStart;
            gt.PublicHolidayStart = gtv.PublicHolidayStart;

            // Close
            gt.MondayClose = gtv.MondayClose;
            gt.TuesdayClose = gtv.TuesdayClose;
            gt.WednesdayClose = gtv.WednesdayClose;
            gt.ThursdayClose = gtv.ThursdayClose;
            gt.FridayClose = gtv.FridayClose;
            gt.SaturdayClose = gtv.SaturdayClose;
            gt.SundayClose = gtv.SundayClose;
            gt.PublicHolidayClose = gtv.PublicHolidayClose;

            return gt;
        }

        public GymTimeViewModel SetGymeTimeViewModel( GymTime gt )
        {
            GymTimeViewModel gtv = new GymTimeViewModel()
            {
                Id = gt.Id,
                EditMode = true,
                GymServiceId = gt.GymServiceId,

                // Open
                OpenOnMonday = gt.OpenOnMonday == true ? YesNo.Yes : YesNo.No,
                OpenOnTuesday = gt.OpenOnTuesday == true ? YesNo.Yes : YesNo.No,
                OpenOnWednesday = gt.OpenOnWednesday == true ? YesNo.Yes : YesNo.No,
                OpenOnThursday = gt.OpenOnThursday == true ? YesNo.Yes : YesNo.No,
                OpenOnFriday = gt.OpenOnFriday == true ? YesNo.Yes : YesNo.No,
                OpenOnSaturday = gt.OpenOnSaturday == true ? YesNo.Yes : YesNo.No,
                OpenOnSunday = gt.OpenOnSunday == true ? YesNo.Yes : YesNo.No,
                OpenOnPublicHoliday = gt.OpenOnPublicHoliday == true ? YesNo.Yes : YesNo.No,

                // Start
                MondayStart = gt.MondayStart,
                TuesdayStart = gt.TuesdayStart,
                WednesdayStart = gt.WednesdayStart,
                ThursdayStart = gt.ThursdayStart,
                FridayStart = gt.FridayStart,
                SaturdayStart = gt.SaturdayStart,
                SundayStart = gt.SundayStart,
                PublicHolidayStart = gt.PublicHolidayStart,

                // Close
                MondayClose = gt.MondayClose,
                TuesdayClose = gt.TuesdayClose,
                WednesdayClose = gt.WednesdayClose,
                ThursdayClose = gt.ThursdayClose,
                FridayClose = gt.FridayClose,
                SaturdayClose = gt.SaturdayClose,
                SundayClose = gt.SundayClose,
                PublicHolidayClose = gt.PublicHolidayClose,
            };

            return gtv;
        }

        //
        // GET: /Gyms/Edit/5
        [Requires( PermissionTo.Edit )]
        public ActionResult Edit( int id )
        {
            Gym gym;

            List<Image> images;
            List<Address> addresses;
            List<Document> documents;
            List<BankDetail> bankDetails;

            using ( Core.Services.GymService service = new Core.Services.GymService() )
            {
                gym = service.GetById( id );
            }

            if ( gym == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return PartialView( "_AccessDenied" );
            }

            using ( ImageService iservice = new ImageService() )
            using ( AddressService aservice = new AddressService() )
            using ( DocumentService dservice = new DocumentService() )
            using ( BankDetailService bservice = new BankDetailService() )
            {
                images = iservice.List( gym.Id, "Gym" );
                addresses = aservice.List( gym.Id, "Gym" );
                documents = dservice.List( gym.Id, "Gym" );
                bankDetails = bservice.List( gym.Id, "Gym" );
            }

            #region Gym

            GymViewModel model = new GymViewModel()
            {
                Id = gym.Id,
                Fax = gym.Fax,
                Name = gym.Name,
                VATNo = gym.VATNo,
                RegNo = gym.RegNo,
                Website = gym.Website,
                POPEmail = gym.POPEmail,
                ContactTel = gym.ContactTel,
                TradingName = gym.TradingName,
                ContactCell = gym.ContactCell,
                CompanyEmail = gym.CompanyEmail,
                ContactEmail = gym.ContactEmail,
                ContactPerson = gym.ContactPerson,
                Status = ( GymStatus ) gym.Status,
                Approved = gym.Approved ? YesNo.Yes : YesNo.No,
                ApproverComment = gym.Approved ? gym.ApproverComments : null,
                EditMode = true,
                Files = new List<FileViewModel>(),
                Addresses = new List<AddressViewModel>(),
                BankDetails = new List<BankDetailViewModel>(),
                Services = new List<ServiceViewModel>()
            };

            #endregion


            #region Services & Time

            if ( gym.GymServices.Any() )
            {
                foreach ( Data.Models.GymService gs in gym.GymServices )
                {
                    model.Services.Add( new ServiceViewModel()
                    {
                        Id = gs.Id,
                        Price = gs.Fee,
                        EditMode = true,
                        Name = gs.Description,
                        Description = gs.Description,
                        Status = ( Status ) gs.Status,
                        GymTime = SetGymeTimeViewModel( gs.GymTimes.FirstOrDefault() )
                    } );
                }
            }

            #endregion


            #region Address

            if ( addresses != null && addresses.NullableAny() )
            {
                foreach ( Address a in addresses )
                {
                    model.Addresses.Add( new AddressViewModel()
                    {
                        Id = a.Id,
                        Town = a.Town,
                        EditMode = true,
                        Latitude = a.Latitude,
                        Longitude = a.Longitude,
                        PostalCode = a.PostalCode,
                        AddressLine1 = a.Addressline1,
                        AddressLine2 = a.Addressline2,
                        Province = ( Province ) a.Province,
                        AddressType = ( AddressType ) a.Type
                    } );
                }
            }

            #endregion


            #region Images

            if ( images != null && images.NullableAny() )
            {
                foreach ( Image i in images )
                {
                    model.Files.Add( new FileViewModel()
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Size = i.Size,
                        Location = i.Location,
                        Extension = i.Extension,
                        ExternalUrl = i.ExternalUrl,
                        Description = i.Description
                    } );
                }
            }

            #endregion


            #region Documents

            if ( documents != null && documents.NullableAny() )
            {
                foreach ( Document d in documents )
                {
                    model.Files.Add( new FileViewModel()
                    {
                        Id = d.Id,
                        Name = d.Name,
                        Extension = d.Type,
                        ExternalUrl = d.Url,
                        Location = d.Location,
                        Size = ( decimal ) d.Size,
                        Description = d.Description
                    } );
                }
            }

            #endregion


            #region Banks

            if ( bankDetails != null && bankDetails.NullableAny() )
            {
                foreach ( BankDetail b in bankDetails )
                {
                    model.BankDetails.Add( new BankDetailViewModel()
                    {
                        Id = b.Id,
                        EditMode = true,
                        Branch = b.Branch,
                        BankId = b.BankId,
                        Account = b.Account,
                        Beneficiary = b.Beneficiary,
                        Status = ( Status ) b.Status,
                        AccountType = ( BankAccountType ) b.AccountType
                    } );
                }
            }

            #endregion


            return View( model );
        }

        //
        // POST: /Gyms/Edit/5
        [HttpPost]
        [Requires( PermissionTo.Edit )]
        public ActionResult Edit( GymViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the selected Gym was not updated. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            Gym gym;

            using ( ImageService iservice = new ImageService() )
            using ( AddressService aservice = new AddressService() )
            using ( GymTimeService gtservice = new GymTimeService() )
            using ( TransactionScope scope = new TransactionScope() )
            using ( DocumentService dservice = new DocumentService() )
            using ( BankDetailService bservice = new BankDetailService() )
            using ( GymServiceService gsservice = new GymServiceService() )
            using ( Core.Services.GymService gservice = new Core.Services.GymService() )
            {
                gym = gservice.GetById( model.Id );

                if ( gym == null )
                {
                    Notify( "Sorry, that Gym does not exist! Please specify a valid Gym Id and try again.", NotificationType.Error );

                    return View( model );
                }

                #region Validations

                if ( ( gym.TradingName?.Trim() != model.TradingName?.Trim() || gym.RegNo?.Trim() != model.RegNo?.Trim() ) && gservice.ExistByTradingNameAndRegNo( model.TradingName.Trim(), model.RegNo.Trim() ) )
                {
                    // Gym already exist!
                    Notify( $"Sorry, a Gym with the Trading Name \"{model.TradingName}\" and Reg # \"{model.RegNo}\" already exists!", NotificationType.Error );

                    return View( model );
                }

                #endregion


                #region Update Gym

                // Update Gym
                gym.Fax = model.Fax;
                gym.Name = model.Name;
                gym.VATNo = model.VATNo;
                gym.RegNo = model.RegNo;
                gym.Website = model.Website;
                gym.Cell = model.ContactCell;
                gym.StatusDate = DateTime.Now;
                gym.POPEmail = model.POPEmail;
                gym.Email = model.ContactEmail;
                gym.Status = ( int ) model.Status;
                gym.ContactTel = model.ContactTel;
                gym.TradingName = model.TradingName;
                gym.ContactCell = model.ContactCell;
                gym.CompanyEmail = model.CompanyEmail;
                gym.ContactEmail = model.ContactEmail;
                gym.ContactPerson = model.ContactPerson;
                gym.Approved = model.Approved == YesNo.Yes ? true : false;
                gym.ApprovedBy = model.Approved == YesNo.Yes ? CurrentUser.Id : ( int? ) null;
                gym.ApprovedOn = model.Approved == YesNo.Yes ? DateTime.Now : ( DateTime? ) null;
                gym.ApproverComments = model.Approved == YesNo.Yes ? model.ApproverComment : null;

                gservice.Update( gym );

                #endregion


                #region Gym Services

                if ( model.Services != null && model.Services.NullableAny() )
                {
                    foreach ( ServiceViewModel s in model.Services )
                    {
                        Data.Models.GymService gs;

                        if ( s.Id > 0 )
                        {
                            gs = gsservice.GetById( s.Id );

                            if ( gs == null ) continue;

                            gs.Fee = s.Price ?? 0;
                            gs.Status = ( int ) s.Status;
                            gs.Description = s.Description;

                            gs = gsservice.Update( gs );
                        }
                        else
                        {
                            gs = new Data.Models.GymService()
                            {
                                GymId = gym.Id,
                                ServiceId = s.Id,
                                Fee = s.Price ?? 0,
                                Description = s.Description,
                                Status = ( int ) Status.Active
                            };

                            gs = gsservice.Create( gs );

                        }

                        if ( s.GymTime != null && s.GymTime.Id > 0 )
                        {
                            GymTime gt = gtservice.GetById( s.GymTime.Id );

                            if ( gt == null ) continue;

                            gt = SetGymeTime( s.GymTime, gt, gs.Id );

                            gtservice.Update( gt );
                        }
                        else if ( s.GymTime != null )
                        {
                            GymTime gt = new GymTime();

                            gt = SetGymeTime( s.GymTime, gt, gs.Id );

                            gtservice.Create( gt );
                        }
                    }
                }

                #endregion


                #region Create Address (s)

                if ( model.Addresses != null && model.Addresses.NullableAny() )
                {
                    foreach ( AddressViewModel a in model.Addresses )
                    {
                        Address address;

                        if ( a.Id > 0 )
                        {
                            address = aservice.GetById( a.Id );

                            if ( address == null ) continue;

                            address.Town = a.Town;
                            address.Latitude = a.Latitude;
                            address.Longitude = a.Longitude;
                            address.PostalCode = a.PostalCode;
                            address.Status = ( int ) a.Status;
                            address.Addressline1 = a.AddressLine1;
                            address.Addressline2 = a.AddressLine2;
                            address.Province = ( int ) a.Province;
                            address.Type = ( int ) a.AddressType;

                            aservice.Update( address );
                        }
                        else
                        {
                            address = new Address()
                            {
                                Town = a.Town,
                                ObjectId = gym.Id,
                                ObjectType = "Gym",
                                Latitude = a.Latitude,
                                Longitude = a.Longitude,
                                PostalCode = a.PostalCode,
                                Type = ( int ) a.AddressType,
                                Province = ( int ) a.Province,
                                Addressline1 = a.AddressLine1,
                                Addressline2 = a.AddressLine2,
                                Status = ( int ) Status.Active
                            };

                            aservice.Create( address );
                        }
                    }
                }

                #endregion


                #region Create Bank Details

                if ( model.BankDetails != null && model.BankDetails.NullableAny( b => b.BankId > 0 ) )
                {
                    foreach ( BankDetailViewModel b in model.BankDetails )
                    {
                        if ( b.BankId <= 0 ) continue;

                        BankDetail bank;

                        if ( b.Id > 0 )
                        {
                            bank = bservice.GetById( b.Id );

                            if ( bank == null ) continue;

                            bank.BankId = b.BankId;
                            bank.Beneficiary = b.Beneficiary;
                            bank.Account = b.Account;
                            bank.Branch = b.Branch;
                            bank.AccountType = ( int ) b.AccountType;
                            bank.Status = ( int ) Status.Active;

                            bservice.Update( bank );
                        }
                        else
                        {
                            bank = new BankDetail()
                            {
                                ObjectId = gym.Id,
                                ObjectType = "Gym",
                                BankId = b.BankId,
                                Beneficiary = b.Beneficiary,
                                Account = b.Account,
                                Branch = b.Branch,
                                AccountType = ( int ) b.AccountType,
                                Status = ( int ) Status.Active
                            };

                            bservice.Create( bank );
                        }
                    }
                }

                #endregion


                #region Any Uploads

                if ( model.Files != null && model.Files.Any( f => f.File != null ) )
                {
                    // Create folder
                    string path = Server.MapPath( $"~/{VariableExtension.SystemRules.ImagesLocation}/Gyms/{gym.Reference}/" );

                    if ( !Directory.Exists( path ) )
                    {
                        Directory.CreateDirectory( path );
                    }

                    string now = DateTime.Now.ToString( "yyyyMMddHHmmss" );

                    foreach ( FileViewModel f in model.Files.Where( f => f.File != null ) )
                    {
                        if ( f.Name.ToLower() == "logo" )
                        {
                            Image image = iservice.Get( gym.Id, "Gym", true );

                            if ( image != null )
                            {
                                string pth = Server.MapPath( $"~/{VariableExtension.SystemRules.ImagesLocation}/{image.Location}" );

                                if ( System.IO.File.Exists( pth ) )
                                {
                                    System.IO.File.Delete( pth );
                                }

                                iservice.Delete( image );
                            }

                            Image iimage = new Image()
                            {
                                Name = f.Name,
                                ObjectId = gym.Id,
                                ObjectType = "Gym",
                                Size = f.File.ContentLength,
                                Description = f.Description,
                                IsMain = ( f.Name.ToLower() == "logo" ),
                                Extension = Path.GetExtension( f.File.FileName ),
                                Location = $"Gyms/{gym.Reference}/{now}-{f.File.FileName}"
                            };

                            iservice.Create( iimage );
                        }
                        else
                        {
                            Document doc = dservice.Get( gym.Id, "Gym", f.Name );

                            if ( doc != null )
                            {
                                string pth = Server.MapPath( $"~/{VariableExtension.SystemRules.ImagesLocation}/{doc.Location}" );

                                if ( System.IO.File.Exists( pth ) )
                                {
                                    System.IO.File.Delete( pth );
                                }

                                dservice.Delete( doc );
                            }

                            Document ddoc = new Document()
                            {
                                Name = f.Name,
                                Category = f.Name,
                                ObjectId = gym.Id,
                                ObjectType = "Gym",
                                Url = f.ExternalUrl,
                                Description = f.Description,
                                Size = f.File.ContentLength,
                                Status = ( int ) Status.Active,
                                Title = Path.GetExtension( f.File.FileName ),
                                Type = Path.GetExtension( f.File.FileName ),
                                Location = $"Gyms/{gym.Reference}/{now}-{f.File.FileName}",
                            };

                            dservice.Create( ddoc );
                        }

                        string fullpath = Path.Combine( path, $"{now}-{f.File.FileName}" );

                        f.File.SaveAs( fullpath );
                    }
                }

                #endregion

                scope.Complete();
            }

            Notify( "The selected Gym details were successfully updated.", NotificationType.Success );

            return RedirectToAction( "Gyms" );
        }

        //
        // POST: /Gyms/Delete/5
        [HttpPost]
        [Requires( PermissionTo.Delete )]
        public ActionResult Delete( GymViewModel model )
        {
            Gym gym = new Gym();

            using ( Core.Services.GymService service = new Core.Services.GymService() )
            {
                gym = service.GetById( model.Id );

                if ( gym == null )
                {
                    Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                    return PartialView( "_AccessDenied" );
                }

                service.Delete( gym );

                Notify( "The selected Gym was successfully Deleted.", NotificationType.Success );
            }

            return RedirectToAction( "Gyms" );
        }

        #region Partial Views

        //
        // POST || GET: /Gym/Gyms
        public ActionResult Gyms( PagingModel pm, CustomSearchModel csm, bool givecsm = false )
        {
            if ( givecsm )
            {
                ViewBag.ViewName = "_Gyms";
                return PartialView( "_GymCustomSearch", new CustomSearchModel( "Gym" ) );
            }

            int total = 0;

            List<GymCustomModel> model = new List<GymCustomModel>();

            using ( Core.Services.GymService service = new Core.Services.GymService() )
            {
                pm.Sort = pm.Sort ?? "DESC";
                pm.SortBy = pm.SortBy ?? "CreatedOn";

                model = service.List1( pm, csm );
                total = ( model.Count < pm.Take && pm.Skip == 0 ) ? model.Count : service.Total1( pm, csm );
            }

            PagingExtension paging = PagingExtension.Create( model, total, pm.Skip, pm.Take, pm.Page );

            return PartialView( "_Gyms", paging );
        }

        #endregion
    }
}