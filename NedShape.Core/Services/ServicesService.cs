using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using NedShape.Core.Enums;
using NedShape.Core.Models;
using NedShape.Data.Models;

namespace NedShape.Core.Services
{
    public class ServicesService : BaseService<Service>, IDisposable
    {
        public ServicesService()
        {

        }

        /// <summary>
        /// Gets a Service using the specified id
        /// </summary>
        /// <param name="id">Id of the Service to be fetched</param>
        /// <returns></returns>
        public override Service GetById( int id )
        {
            Service service = context.Services
                                  .Include( "GymServices" )
                                  .Include( "GymServices.Gym" )
                                  .FirstOrDefault( s => s.Id == id );

            OldObject = context.Services.AsNoTracking().FirstOrDefault( s => s.Id == id );

            return service;
        }

        /// <summary>
        /// Gets a count of gym records for the specified params
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public int Total1( PagingModel pm, CustomSearchModel csm )
        {
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue && csm.FromDate?.Date == csm.ToDate?.Date )
            {
                csm.ToDate = csm.ToDate?.AddDays( 1 );
            }

            // Parameters

            #region Parameters

            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "skip", pm.Skip ) },
                { new SqlParameter( "take", pm.Take ) },
                { new SqlParameter( "userid", ( CurrentUser != null ) ? CurrentUser.Id : 0 ) },
                { new SqlParameter( "query", csm.Query ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmToDate", csm.ToDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmFromDate", csm.FromDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmStatus", ( int ) csm.Status ) },
                { new SqlParameter( "aStatus", ( int ) Status.Active ) }
            };

            #endregion

            string query = string.Empty;

            query = string.Format( @"SELECT
	                                   COUNT(1) AS [Total]
                                     FROM 
	                                    [dbo].[Service] s", query );

            // WHERE

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            #endregion

            // Custom Search

            #region Custom Search

            if ( csm.Status != Status.All )
            {
                query = $"{query} AND (s.Status=@csmStatus) ";
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = $"{query} AND (s.CreatedOn >= @csmFromDate AND s.CreatedOn <= @csmToDate) ";
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = $"{query} AND (s.CreatedOn>=@csmFromDate) ";
                }
                if ( csm.ToDate.HasValue )
                {
                    query = $"{query} AND (s.CreatedOn<=@csmToDate) ";
                }
            }

            #endregion

            // Normal Search

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (s.[Name] LIKE '%{1}%' OR
                                                  s.[Description] LIKE '%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            CountModel model = context.Database.SqlQuery<CountModel>( query.Trim(), parameters.ToArray() ).FirstOrDefault();

            return model.Total;
        }

        /// <summary>
        /// Gets a list of service record for the specified params
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public List<ServiceCustomModel> List1( PagingModel pm, CustomSearchModel csm )
        {
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue && csm.FromDate?.Date == csm.ToDate?.Date )
            {
                csm.ToDate = csm.ToDate?.AddDays( 1 );
            }

            // Parameters

            #region Parameters

            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "skip", pm.Skip ) },
                { new SqlParameter( "take", pm.Take ) },
                { new SqlParameter( "userid", ( CurrentUser != null ) ? CurrentUser.Id : 0 ) },
                { new SqlParameter( "query", csm.Query ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmToDate", csm.ToDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmFromDate", csm.FromDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmStatus", ( int ) csm.Status ) },
                { new SqlParameter( "aStatus", ( int ) Status.Active ) }
            };

            #endregion

            string query = string.Empty;

            query = string.Format( @"SELECT
	                                   s.*,
	                                   cbu.Name + ' ' + cbu.Surname AS [CreatedByUser],
	                                   mbu.Name + ' ' + mbu.Surname AS [ModifiedByUser],
                                       (SELECT COUNT(1) FROM [dbo].[GymService] gs WHERE gs.[ServiceId]=s.Id AND s.[Status]=@aStatus) AS [GymCount]
                                     FROM 
	                                    [dbo].[Service] s
	                                 LEFT OUTER JOIN [dbo].[User] cbu ON cbu.Id=s.CreatedBy
	                                 LEFT OUTER JOIN [dbo].[User] mbu ON mbu.Id=s.ModifiedBy", query );

            // WHERE

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            #endregion

            // Custom Search

            #region Custom Search

            if ( csm.Status != Status.All )
            {
                query = $"{query} AND (s.Status=@csmStatus) ";
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = $"{query} AND (s.CreatedOn >= @csmFromDate AND s.CreatedOn <= @csmToDate) ";
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = $"{query} AND (s.CreatedOn>=@csmFromDate) ";
                }
                if ( csm.ToDate.HasValue )
                {
                    query = $"{query} AND (s.CreatedOn<=@csmToDate) ";
                }
            }

            #endregion

            // Normal Search

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (s.[Name] LIKE '%{1}%' OR
                                                  s.[Description] LIKE '%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            // ORDER

            query = string.Format( "{0} ORDER BY {1} {2} ", query, pm.SortBy, pm.Sort );

            // SKIP, TAKE

            query = string.Format( "{0} OFFSET (@skip) ROWS FETCH NEXT (@take) ROWS ONLY ", query );

            return context.Database.SqlQuery<ServiceCustomModel>( query.Trim(), parameters.ToArray() ).ToList();
        }

        /// <summary>
        /// Gets a unique list of services
        /// </summary>
        /// <returns></returns>
        public Dictionary<int, string> SimpleList()
        {
            Dictionary<int, string> dic = new Dictionary<int, string>();
            List<IntStringKeyValueModel> model = new List<IntStringKeyValueModel>();

            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "userid", CurrentUser.Id ) },
                { new SqlParameter( "aStatus", ( int ) Status.Active ) }
            };

            string query = "SELECT s.Id AS TKey, s.Name AS TValue FROM [dbo].[Service] s WHERE s.[Status]=@aStatus";

            query = string.Format( "{0} ORDER BY s.Name ASC ", query );

            model = context.Database.SqlQuery<IntStringKeyValueModel>( query.Trim(), parameters.ToArray() ).ToList();

            if ( model != null && model.Any() )
            {
                foreach ( var k in model )
                {
                    if ( dic.Keys.Any( x => x == k.TKey ) )
                        continue;

                    dic.Add( k.TKey, ( k.TValue ?? "" ).Trim() );
                }
            }

            return dic;
        }

        /// <summary>
        /// Checks if a service with the specified name already exists..
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public bool ExistByName( string name )
        {
            return context.Services.Any( s => s.Name.ToLower() == name.ToLower() );
        }
    }
}
