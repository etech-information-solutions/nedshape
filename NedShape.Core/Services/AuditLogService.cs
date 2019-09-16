using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Linq.Dynamic;
using NedShape.Data.Models;
using NedShape.Core.Enums;
using NedShape.Core.Models;
using System.Web.Script.Serialization;
using System.Dynamic;
using System.Data.Entity;
using System.Data.SqlClient;

namespace NedShape.Core.Services
{
    public class AuditLogService : BaseService<AuditLog>, IDisposable
    {
        private NedShapeEntities _context = new NedShapeEntities();

        public AuditLogService()
        {
        }

        /// <summary>
        /// Gets a total count of audits matching the search filters
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public override int Total( PagingModel pm, CustomSearchModel csm )
        {
            string query = string.Empty;

            if ( !string.IsNullOrEmpty( csm.ControllerName ) )
            {
                csm.ControllerName = csm.ControllerName.Replace( "Controller", "" );
            }

            #region Parameters

            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "skip", pm.Skip ) },
                { new SqlParameter( "take", pm.Take ) },
                { new SqlParameter( "csmUserId", csm.UserId ) },
                { new SqlParameter( "actt", ( object )( int ) csm.ActivityType ) },
                { new SqlParameter( "query", csm.Query ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmToDate", csm.ToDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmTable", csm.TableName ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "userid", ( CurrentUser != null ) ? CurrentUser.Id : 0 ) },
                { new SqlParameter( "csmFromDate", csm.FromDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmCtr", csm.ControllerName ?? ( object ) DBNull.Value ) }
            };

            #endregion

            query = $@"{query} SELECT
                                  COUNT(1) AS [Total]
                               FROM
                                  [dbo].[AuditLog] a
                                  INNER JOIN [dbo].[User] u ON u.Id=a.UserId";

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            //if ( CurrentUser != null && CurrentUser.Id != 0 && CurrentUser.RoleType != RoleType.SuperAdmin )
            //{
            //    query = string.Format( "{0} AND EXISTS(SELECT 1 FROM [dbo].[UserStructure] us WHERE us.UserId=@userid AND us.Branch=u.Branch) ", query );
            //}

            #endregion

            #region Custom Search
            
            if ( !string.IsNullOrEmpty( csm.TableName ) )
            {
                query = $"{query} AND (a.[ActionTable]=@csmTable) ";
            }
            if ( !string.IsNullOrEmpty( csm.ControllerName ) )
            {
                query = $"{query} AND (a.[Controller]=@csmCtr) ";
            }
            if ( csm.UserId != 0 )
            {
                query = string.Format( "{0} AND (a.UserId=@csmUserId) ", query );
            }
            if ( csm.ActivityType != ActivityTypes.All )
            {
                query = string.Format( "{0} AND (a.[Type]=@actt) ", query );
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = string.Format( "{0} AND (a.CreatedOn>=@csmFromDate AND a.CreatedOn<@csmToDate) ", query );
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = string.Format( "{0} AND (a.CreatedOn>=@csmFromDate) ", query );
                }
                if ( csm.ToDate.HasValue )
                {
                    query = string.Format( "{0} AND (a.CreatedOn<=@csmToDate) ", query );
                }
            }

            #endregion

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (a.Parameters LIKE'%{1}%' OR
                                                  a.BeforeImage LIKE'%{1}%' OR
                                                  a.AfterImage LIKE'%{1}%' OR
                                                  a.Comments LIKE'%{1}%' OR
                                                  a.Controller LIKE'%{1}%' OR
                                                  a.ActionTable LIKE'%{1}%' OR
                                                  u.Name LIKE'%{1}%' OR
                                                  u.Surname LIKE'%{1}%' OR
                                                  u.Email LIKE'%{1}%' OR
                                                  u.IdNumber LIKE'%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            CountModel count = context.Database.SqlQuery<CountModel>( query.Trim(), parameters.ToArray() ).FirstOrDefault();

            return count.Total;
        }

        /// <summary>
        /// Gets a list of Audit Logs matching the search filters
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public new List<AuditLogCustomModel> List( PagingModel pm, CustomSearchModel csm )
        {
            string query = string.Empty;

            if ( !string.IsNullOrEmpty( csm.ControllerName ) )
            {
                csm.ControllerName = csm.ControllerName.Replace( "Controller", "" );
            }
            
            #region Parameters

            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "skip", pm.Skip ) },
                { new SqlParameter( "take", pm.Take ) },
                { new SqlParameter( "csmUserId", csm.UserId ) },
                { new SqlParameter( "actt", ( object )( int ) csm.ActivityType ) },
                { new SqlParameter( "query", csm.Query ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmToDate", csm.ToDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmTable", csm.TableName ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "userid", ( CurrentUser != null ) ? CurrentUser.Id : 0 ) },
                { new SqlParameter( "csmFromDate", csm.FromDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmCtr", csm.ControllerName ?? ( object ) DBNull.Value ) }
            };

            #endregion

            query = $@"{query} SELECT
                                  a.*,
                                  u.Name + ' ' + u.Surname AS [UserName]
                               FROM
                                  [dbo].[AuditLog] a
                                  INNER JOIN [dbo].[User] u ON u.Id=a.UserId";

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            #endregion

            #region Custom Search
            
            if ( !string.IsNullOrEmpty( csm.TableName ) )
            {
                query = $"{query} AND (a.[ActionTable]=@csmTable) ";
            }
            if ( !string.IsNullOrEmpty( csm.ControllerName ) )
            {
                query = $"{query} AND (a.[Controller]=@csmCtr) ";
            }
            if ( csm.UserId != 0 )
            {
                query = string.Format( "{0} AND (a.UserId=@csmUserId) ", query );
            }
            if ( csm.ActivityType != ActivityTypes.All )
            {
                query = string.Format( "{0} AND (a.[Type]=@actt) ", query );
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = string.Format( "{0} AND (a.CreatedOn>=@csmFromDate AND a.CreatedOn<@csmToDate) ", query );
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = string.Format( "{0} AND (a.CreatedOn>=@csmFromDate) ", query );
                }
                if ( csm.ToDate.HasValue )
                {
                    query = string.Format( "{0} AND (a.CreatedOn<=@csmToDate) ", query );
                }
            }

            #endregion

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (a.Parameters LIKE'%{1}%' OR
                                                  a.BeforeImage LIKE'%{1}%' OR
                                                  a.AfterImage LIKE'%{1}%' OR
                                                  a.Comments LIKE'%{1}%' OR
                                                  a.Controller LIKE'%{1}%' OR
                                                  a.ActionTable LIKE'%{1}%' OR
                                                  u.Name LIKE'%{1}%' OR
                                                  u.Surname LIKE'%{1}%' OR
                                                  u.Email LIKE'%{1}%' OR
                                                  u.IdNumber LIKE'%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            // ORDER
            query = string.Format( "{0} ORDER BY {1} {2} ", query, pm.SortBy, pm.Sort );

            // SKIP, TAKE
            query = string.Format( "{0} OFFSET (@skip) ROWS FETCH NEXT (@take) ROWS ONLY ", query );

            context.Database.CommandTimeout = 6000;

            List<AuditLogCustomModel> list = context.Database.SqlQuery<AuditLogCustomModel>( query.Trim(), parameters.ToArray() ).ToList();

            return list;
        }

        /// <summary>
        /// Gets a list of audit logs using the specified action table
        /// </summary>
        /// <param name="actionTable"></param>
        /// <returns></returns>
        public List<AuditLog> ListByActionTable( string actionTable )
        {
            return context.AuditLogs.Where( a => a.ActionTable == actionTable )
                                    .OrderByDescending( o => o.CreatedOn )
                                    .ToList();
        }
        
        /// <summary>
        /// Gets an activity using the specified id
        /// </summary>
        /// <param name="id">Id of the activity to be fetched</param>
        /// <returns></returns>
        public new AuditLogCustomModel GetById( int id )
        {
            return ( from a in _context.AuditLogs
                     join user in _context.Users on a.UserId equals user.Id into temp
                     from u in temp.DefaultIfEmpty()

                     where
                     (
                         a.Id == id
                     )

                     select new AuditLogCustomModel
                     {
                         #region Properties

                         Id = a.Id,
                         Type = a.Type,
                         UserId = a.UserId,
                         Action = a.Action,
                         Browser = a.Browser,
                         ObjectId = a.ObjectId,
                         Comments = a.Comments,
                         CreatedOn = a.CreatedOn,
                         Controller = a.Controller,
                         AfterImage = a.AfterImage,
                         ModifiedBy = a.ModifiedBy,
                         ModifiedOn = a.ModifiedOn,
                         Parameters = a.Parameters,
                         BeforeImage = a.BeforeImage,
                         ActionTable = a.ActionTable,
                         IsAjaxRequest = a.IsAjaxRequest,

                         User = u

                         #endregion
                     } ).FirstOrDefault();
        }

        /// <summary>
        /// Creates a new audit log
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="activity"></param>
        /// <param name="newItem"></param>
        /// <param name="oldItem"></param>
        public bool Create<T>( ActivityTypes activity, T newItem, T oldItem = null ) where T : class
        {
            try
            {
                dynamic oldObj = new ExpandoObject(),
                        newObj = new ExpandoObject();

                var oldDic = oldObj as IDictionary<string, object>;
                var newDic = newObj as IDictionary<string, object>;

                if ( oldItem != null )
                {
                    var oldprops = oldItem.GetType().GetProperties();

                    foreach ( var item in oldprops )
                    {
                        if (
                            ( item.PropertyType != null ) &&
                            ( item.PropertyType == typeof( string ) ||
                              item.PropertyType == typeof( int ) ||
                              item.PropertyType == typeof( Nullable<int> ) ||
                              item.PropertyType == typeof( decimal ) ||
                              item.PropertyType == typeof( Nullable<decimal> ) ||
                              item.PropertyType == typeof( DateTime ) ||
                              item.PropertyType == typeof( Nullable<DateTime> ) ||
                              item.PropertyType == typeof( double ) ||
                              item.PropertyType == typeof( Nullable<double> ) ||
                              item.PropertyType == typeof( TimeSpan ) ||
                              item.PropertyType == typeof( Nullable<TimeSpan> ) ||
                              item.PropertyType == typeof( bool ) ||
                              item.PropertyType == typeof( Nullable<bool> ) ||
                              item.PropertyType == typeof( byte ) ||
                              item.PropertyType == typeof( Nullable<byte> ) )
                           )
                        {
                            oldDic[ item.Name ] = item.GetValue( oldItem );
                        }
                    }
                }

                var props = newItem.GetType().GetProperties();

                foreach ( var item in props )
                {
                    if (
                        ( item.PropertyType != null ) &&
                        ( item.PropertyType == typeof( string ) ||
                            item.PropertyType == typeof( int ) ||
                            item.PropertyType == typeof( Nullable<int> ) ||
                            item.PropertyType == typeof( decimal ) ||
                            item.PropertyType == typeof( Nullable<decimal> ) ||
                            item.PropertyType == typeof( DateTime ) ||
                            item.PropertyType == typeof( Nullable<DateTime> ) ||
                            item.PropertyType == typeof( double ) ||
                            item.PropertyType == typeof( Nullable<double> ) ||
                            item.PropertyType == typeof( TimeSpan ) ||
                            item.PropertyType == typeof( Nullable<TimeSpan> ) ||
                            item.PropertyType == typeof( bool ) ||
                            item.PropertyType == typeof( Nullable<bool> ) ||
                            item.PropertyType == typeof( byte ) ||
                            item.PropertyType == typeof( Nullable<byte> ) )
                      )
                    {
                        newDic[ item.Name ] = item.GetValue( newItem );
                    }
                }

                string actionTable = newItem.GetType().BaseType.Name;

                if ( actionTable.ToLower() == "object" )
                {
                    actionTable = newItem.GetType().Name;
                }

                string before = ( oldItem != null ) ? Newtonsoft.Json.JsonConvert.SerializeObject( oldObj ) : string.Empty;
                string after = ( newObj != null ) ? Newtonsoft.Json.JsonConvert.SerializeObject( newObj ) : string.Empty;

                //if ( before == after ) return false;

                System.Web.HttpBrowserCapabilities browser = HttpContext.Current.Request.Browser;

                string b = string.Format( "Type={1} {0} Name={2} {0} Version={3} {0} Platform={4} {0} Supports JavaScript={5}", Environment.NewLine,
                                           browser.Type, browser.Browser, browser.Version, browser.Platform, browser.EcmaScriptVersion.ToString() );

                AuditLog log = new AuditLog()
                {
                    CreatedOn = DateTime.Now,
                    ModifiedOn = DateTime.Now,
                    Type = ( int ) activity,
                    ActionTable = actionTable,
                    Browser = b,
                    UserId = ( ( CurrentUser != null ) ? CurrentUser.Id : 0 ),
                    CreatedBy = ( ( CurrentUser != null ) ? CurrentUser.Id : 0 ),
                    ModifiedBy = ( ( CurrentUser != null ) ? CurrentUser.Id : 0 ),
                    Comments = string.Format( "Created/Updated a {0}", actionTable ),
                    Action = HttpContext.Current.Request.RequestContext.RouteData.Values[ "action" ] as string,
                    IsAjaxRequest = ( HttpContext.Current.Request.Headers[ "X-Requested-With" ] == "XMLHttpRequest" ),
                    Controller = HttpContext.Current.Request.RequestContext.RouteData.Values[ "controller" ] as string,
                    AfterImage = after,
                    BeforeImage = before,
                    ObjectId = ( int ) newItem.GetType().GetProperties().FirstOrDefault( x => x.Name == "Id" ).GetValue( newItem ),
                    Parameters = new JavaScriptSerializer().Serialize( HttpContext.Current.Request.RequestContext.RouteData.Values )
                };

                _context.AuditLogs.Add( log );
                _context.SaveChanges();
            }
            catch ( Exception ex )
            {

            }

            return true;
        }

        private object ChangeDate( object obj )
        {
            if ( obj == null ) return null;

            foreach ( var i in obj.GetType().GetProperties().Where( t => t.PropertyType == typeof( DateTime ) || t.PropertyType == typeof( Nullable<DateTime> ) ) )
            {
                DateTime? date = ( DateTime? ) i.GetValue( obj );
                i.SetValue( obj, date?.ToLocalTime(), null );
            }

            return obj;
        }
    }
}
