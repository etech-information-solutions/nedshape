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
using System.Web;
using System.Web.Mvc;

namespace NedShape.UI.Controllers
{
    [Requires( PermissionTo.View, PermissionContext.Services )]
    public class ServiceController : BaseController
    {
        // GET: Service
        public ActionResult Index()
        {
            return View();
        }


        // GET: /Service/Details/5
        public ActionResult Details( int id, bool layout = true )
        {
            Service model = new Service();

            using ( ServicesService service = new ServicesService() )
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
        // GET: /Service/Add/5 
        //[Requires( PermissionTo.Create )]
        public ActionResult Add()
        {
            ServiceViewModel model = new ServiceViewModel() { EditMode = true };

            return View( model );
        }

        //
        // POST: /Service/Add/5
        [HttpPost]
        //[Requires( PermissionTo.Create )]
        public ActionResult Add( ServiceViewModel model )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the Service was not created. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            using ( ServicesService sservice = new ServicesService() )
            {
                #region Validations

                if ( sservice.ExistByName( model.Name.Trim() ) )
                {
                    // Service already exist!
                    Notify( $"Sorry, a Service with the name \"{model.Name}\" already exists!", NotificationType.Error );

                    return View( model );
                }

                #endregion

                #region Create Service

                // Create Service
                Service s = new Service()
                {
                    Name = model.Name,
                    Price = model.Price,
                    Status = ( int ) model.Status,
                    Description = model.Description
                };

                sservice.Create( s );

                #endregion

                // We're done here..
            }

            Notify( "The Service was successfully created.", NotificationType.Success );

            return RedirectToAction( "Services" );
        }

        //
        // GET: /Service/Edit/5
        //[Requires( PermissionTo.Edit )]
        public ActionResult Edit( int id )
        {
            Service s;

            using ( ServicesService service = new ServicesService() )
            {
                s = service.GetById( id );
            }

            if ( s == null )
            {
                Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                return PartialView( "_AccessDenied" );
            }

            ServiceViewModel model = new ServiceViewModel()
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price,
                Description = s.Description,
                Status = ( Status ) s.Status,
                EditMode = true
            };

            return View( model );
        }

        //
        // POST: /Service/Edit/5
        [HttpPost]
        //[Requires( PermissionTo.Edit )]
        public ActionResult Edit( ServiceViewModel model, PagingModel pm )
        {
            if ( !ModelState.IsValid )
            {
                Notify( "Sorry, the selected Service was not updated. Please correct all errors and try again.", NotificationType.Error );

                return View( model );
            }

            Service s;

            using ( ServicesService rservice = new ServicesService() )
            {
                s = rservice.GetById( model.Id );

                if ( s == null )
                {
                    Notify( "Sorry, that Service does not exist! Please specify a valid Service Id and try again.", NotificationType.Error );

                    return View( model );
                }

                #region Validations

                if ( !s.Name.Trim().Equals( model.Name ) && rservice.ExistByName( model.Name.Trim() ) )
                {
                    // Service already exist!
                    Notify( $"Sorry, a Service with the ID Number \"{model.Name}\" already exists!", NotificationType.Error );

                    return View( model );
                }

                #endregion

                #region Update Service

                // Update Service
                s.Name = model.Name;
                s.Price = model.Price;
                s.Status = ( int ) model.Status;
                s.Description = model.Description;

                rservice.Update( s );

                #endregion
            }

            Notify( "The selected Service details were successfully updated.", NotificationType.Success );

            return RedirectToAction( "Services" );
        }

        //
        // POST: /Service/Delete/5
        [HttpPost]
        //[Requires( PermissionTo.Delete )]
        public ActionResult Delete( ServiceViewModel model, PagingModel pm )
        {
            Service s;

            using ( ServicesService service = new ServicesService() )
            {
                s = service.GetById( model.Id );

                if ( s == null )
                {
                    Notify( "Sorry, the requested resource could not be found. Please try again", NotificationType.Error );

                    return PartialView( "_AccessDenied" );
                }

                service.Delete( s );

                Notify( "The selected Service was successfully Deleted.", NotificationType.Success );
            }

            return RedirectToAction( "List" );
        }

        #region Partial Views

        //
        // POST || GET: /Service/Services
        public ActionResult Services( PagingModel pm, CustomSearchModel csm, bool givecsm = false )
        {
            if ( givecsm )
            {
                ViewBag.ViewName = "_Services";
                return PartialView( "_ServiceCustomSearch", new CustomSearchModel( "Gym" ) );
            }

            int total = 0;

            List<ServiceCustomModel> model = new List<ServiceCustomModel>();

            using ( ServicesService service = new ServicesService() )
            {
                pm.Sort = pm.Sort ?? "DESC";
                pm.SortBy = pm.SortBy ?? "CreatedOn";

                model = service.List1( pm, csm );
                total = ( model.Count < pm.Take && pm.Skip == 0 ) ? model.Count : service.Total1( pm, csm );
            }

            PagingExtension paging = PagingExtension.Create( model, total, pm.Skip, pm.Take, pm.Page );

            return PartialView( "_Services", paging );
        }

        #endregion
    }
}