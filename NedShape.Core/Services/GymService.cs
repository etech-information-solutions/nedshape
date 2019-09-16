using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using NedShape.Core.Enums;
using NedShape.Core.Models;
using NedShape.Data.Models;

namespace NedShape.Core.Services
{
    public class GymService : BaseService<Gym>, IDisposable
    {
        public GymService()
        {

        }

        /// <summary>
        /// Gets a gym using the specified id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Gym GetById(int id)
        {
            OldObject = context.Gyms.AsNoTracking().FirstOrDefault( s => s.Id == id );

            context.Configuration.LazyLoadingEnabled = true;
            context.Configuration.ProxyCreationEnabled = true;

            return context.Gyms.FirstOrDefault( g => g.Id == id );
        }

        /// <summary>
        /// Gets a list of gyms record for the specified params
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
                { new SqlParameter( "csmServiceId", ( int ) csm.ServiceId ) },
                { new SqlParameter( "csmProvince", ( int ) csm.Province ) },
                { new SqlParameter( "csmGymStatus", ( int ) csm.GymStatus ) }
            };

            #endregion

            string query = string.Empty;

            query = string.Format( @"SELECT
	                                   COUNT(1) AS [Total]
                                     FROM 
	                                    [dbo].[Gym] g", query );

            // WHERE

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            #endregion

            // Custom Search

            #region Custom Search

            if ( csm.GymStatus != GymStatus.All )
            {
                query = $"{query} AND (g.Status=@csmGymStatus) ";
            }
            if ( csm.Province != Province.Any )
            {
                query = $"{query} AND EXISTS(SELECT 1 FROM [dbo].[Address] a WHERE a.ObjectId=g.Id AND a.ObjectType='Gym' AND a.Province=@csmProvince) ";
            }
            if ( csm.ServiceId != 0 )
            {
                query = $"{query} AND EXISTS(SELECT 1 FROM [dbo].[GymService] gs WHERE gs.GymId=g.Id AND gs.ServiceId=@csmServiceId) ";
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = $"{query} AND (g.CreatedOn >= @csmFromDate AND g.CreatedOn <= @csmToDate) ";
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = $"{query} AND (g.CreatedOn>=@csmFromDate) ";
                }
                if ( csm.ToDate.HasValue )
                {
                    query = $"{query} AND (g.CreatedOn<=@csmToDate) ";
                }
            }

            #endregion

            // Normal Search

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (g.[Name] LIKE '%{1}%' OR
                                                  g.[TradingName] LIKE '%{1}%' OR
                                                  g.[RegNo] LIKE '%{1}%' OR
                                                  g.[CompanyEmail] LIKE '%{1}%' OR
                                                  g.[Email] LIKE '%{1}%' OR
                                                  g.[Cell] LIKE '%{1}%' OR
                                                  g.[ContactPerson] LIKE '%{1}%' OR
                                                  g.[ContactEmail] LIKE '%{1}%' OR
                                                  g.[ContactTel] LIKE '%{1}%' OR
                                                  g.[ContactCell] LIKE '%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            CountModel model = context.Database.SqlQuery<CountModel>( query.Trim(), parameters.ToArray() ).FirstOrDefault();

            return model.Total;
        }

        /// <summary>
        /// Gets a list of gyms record for the specified params
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public List<GymCustomModel> List1( PagingModel pm, CustomSearchModel csm )
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
                { new SqlParameter( "csmServiceId", ( int ) csm.ServiceId ) },
                { new SqlParameter( "csmProvince", ( int ) csm.Province ) },
                { new SqlParameter( "csmGymStatus", ( int ) csm.GymStatus ) }
            };

            #endregion

            string query = string.Empty;

            query = string.Format( @"SELECT
	                                   g.*,
	                                   cbu.Name + ' ' + cbu.Surname AS [CreatedByUser],
	                                   mbu.Name + ' ' + mbu.Surname AS [ModifiedByUser],
	                                   abu.Name + ' ' + abu.Surname AS [ApprovedByUser],
                                       (SELECT COUNT(1) FROM [dbo].[Address] a WHERE a.ObjectId=g.Id AND a.ObjectType='Gym') AS [AddressCount],
                                       (SELECT COUNT(1) FROM [dbo].[Image] i WHERE i.ObjectId=g.Id AND i.ObjectType='Gym') AS [ImageCount],
                                       (SELECT COUNT(1) FROM [dbo].[Document] d WHERE d.ObjectId=g.Id AND d.ObjectType='Gym') AS [DocumentCount],
                                       (SELECT COUNT(1) FROM [dbo].[BankDetail] bd WHERE bd.ObjectId=g.Id AND bd.ObjectType='Gym') AS [BankCount],
                                       (SELECT COUNT(1) FROM [dbo].[GymService] gs WHERE gs.GymId=g.Id) AS [ServiceCount],
                                       (SELECT COUNT(1) FROM [dbo].[GymUser] gu WHERE gu.GymId=g.Id) AS [UserCount],
                                       (SELECT COUNT(1) FROM [dbo].[GymMember] gm WHERE gm.GymId=g.Id) AS [MemberCount]
                                     FROM 
	                                    [dbo].[Gym] g
	                                 LEFT OUTER JOIN [dbo].[User] cbu ON cbu.Id=g.CreatedBy
	                                 LEFT OUTER JOIN [dbo].[User] mbu ON mbu.Id=g.ModifiedBy
	                                 LEFT OUTER JOIN [dbo].[User] abu ON abu.Id=g.ApprovedBy", query );

            // WHERE

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            #endregion

            // Custom Search

            #region Custom Search

            if ( csm.GymStatus != GymStatus.All )
            {
                query = $"{query} AND (g.Status=@csmGymStatus) ";
            }
            if ( csm.Province != Province.Any )
            {
                query = $"{query} AND EXISTS(SELECT 1 FROM [dbo].[Address] a WHERE a.ObjectId=g.Id AND a.ObjectType='Gym' AND a.Province=@csmProvince) ";
            }
            if ( csm.ServiceId != 0 )
            {
                query = $"{query} AND EXISTS(SELECT 1 FROM [dbo].[GymService] gs WHERE gs.GymId=g.Id AND gs.ServiceId=@csmServiceId) ";
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = $"{query} AND (g.CreatedOn >= @csmFromDate AND g.CreatedOn <= @csmToDate) ";
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = $"{query} AND (g.CreatedOn>=@csmFromDate) ";
                }
                if ( csm.ToDate.HasValue )
                {
                    query = $"{query} AND (g.CreatedOn<=@csmToDate) ";
                }
            }

            #endregion

            // Normal Search

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (g.[Name] LIKE '%{1}%' OR
                                                  g.[TradingName] LIKE '%{1}%' OR
                                                  g.[RegNo] LIKE '%{1}%' OR
                                                  g.[CompanyEmail] LIKE '%{1}%' OR
                                                  g.[Email] LIKE '%{1}%' OR
                                                  g.[Cell] LIKE '%{1}%' OR
                                                  g.[ContactPerson] LIKE '%{1}%' OR
                                                  g.[ContactEmail] LIKE '%{1}%' OR
                                                  g.[ContactTel] LIKE '%{1}%' OR
                                                  g.[ContactCell] LIKE '%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            // ORDER

            query = string.Format( "{0} ORDER BY {1} {2} ", query, pm.SortBy, pm.Sort );

            // SKIP, TAKE

            query = string.Format( "{0} OFFSET (@skip) ROWS FETCH NEXT (@take) ROWS ONLY ", query );

            return context.Database.SqlQuery<GymCustomModel>( query.Trim(), parameters.ToArray() ).ToList();
        }

        /// <summary>
        /// Checks if a gym existing using the specified Trading Name and Reg No
        /// </summary>
        /// <param name="tradingName"></param>
        /// <param name="regNo"></param>
        /// <returns></returns>
        public bool ExistByTradingNameAndRegNo( string tradingName, string regNo )
        {
            return context.Gyms.Any( g => g.TradingName.ToLower() == tradingName && g.RegNo.ToLower() == regNo.ToLower() );
        }
    }
}
