using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Dynamic;
using NedShape.Core.Enums;
using NedShape.Core.Models;
using NedShape.Data.Models;
using System.Data.SqlClient;

namespace NedShape.Core.Services
{
    public class UserService : BaseService<User>, IDisposable
    {
        public UserService()
        {

        }

        /// <summary>
        /// Gets a user using the specified id
        /// </summary>
        /// <param name="id">Id of the user to be fetched</param>
        /// <returns></returns>
        public override User GetById( int id )
        {
            User user = context.Users
                               .Include( "UserRoles" )
                               .Include( "UserRoles.Role" )
                               .FirstOrDefault( u => u.Id == id );

            OldObject = context.Users.AsNoTracking().FirstOrDefault( u => u.Id == id );

            return user;
        }

        /// <summary>
        /// Gets a user using the specified Email Address
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public User GetByEmail( string email )
        {
            return context.Users.FirstOrDefault( u => u.Email == email );
        }

        /// <summary>
        /// Gets a user using the specified Id Number
        /// </summary>
        /// <param name="idNumber"></param>
        /// <returns></returns>
        public User GetByIdNumber( string idNumber )
        {
            return context.Users.FirstOrDefault( u => u.IdNumber == idNumber );
        }

        /// <summary>
        /// Gets a user using the specified id
        /// </summary>
        /// <param name="id">Id of the user to be fetched</param>
        /// <returns></returns>
        public SimpleUserModel GetSimpleById( int id )
        {
            SimpleUserModel user = ( SimpleUserModel ) ContextExtensions.GetCachedUserData( "simpu_" + id );

            if ( user != null )
            {
                return user;
            }

            // Parameters
            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "uid", id ) }
            };

            string query = "SELECT u.Id, u.Name, u.Surname, u.Email, u.IdNumber, u.Name + ' ' + u.Surname AS DisplayName FROM [dbo].[User] u WHERE u.Id=@uid";

            user = context.Database.SqlQuery<SimpleUserModel>( query.Trim(), parameters.ToArray() ).FirstOrDefault();

            ContextExtensions.CacheUserData( "simpu_" + id, user );

            return user;
        }

        /// <summary>
        /// Gets a total list of users using the provided filters
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public override int Total( PagingModel pm, CustomSearchModel csm )
        {
            string[] qs = ( csm.Query ?? "" ).Split( ' ' );

            return ( from u in context.Users

                     #region Where

                     where
                     (
                         // Where
                         //u.UserRoles.Any( ur => ur.Role.Type != ( int ) RoleType.Member && ur.Role.Type != ( int ) RoleType.GymUser ) &&



                         // Custom Search
                         (
                            ( ( csm.Status != Status.All ) ? u.Status == ( int ) csm.Status : true ) &&
                            ( ( csm.RoleType != RoleType.All ) ? u.UserRoles.Any( ur => ur.Role.Type == ( int ) csm.RoleType ) : true ) &&
                            ( ( csm.Province != Province.Any ) ? context.Addresses.Any( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Province == ( int ) csm.Province ) : true )
                         ) &&



                         // Normal Search
                         (
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Name ) || qs.All( q => u.Name.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Cell ) || qs.All( q => u.Cell.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Email ) || qs.All( q => u.Email.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Surname ) || qs.All( q => u.Surname.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.JobTitle ) || qs.All( q => u.JobTitle.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.IdNumber ) || qs.All( q => u.IdNumber.ToLower().Contains( q.ToLower() ) ) ) : true )
                        )
                     )

                     #endregion

                     select u ).Count();
        }

        /// <summary>
        /// Gets a list of users using the provided filters
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public override List<User> List( PagingModel pm, CustomSearchModel csm )
        {
            string[] qs = ( csm.Query ?? "" ).Split( ' ' );

            context.Configuration.LazyLoadingEnabled = true;
            context.Configuration.ProxyCreationEnabled = true;

            return ( from u in context.Users

                     #region Where

                     where
                     (
                         // Where
                         //!u.UserRoles.Any( ur => ur.Role.Type == ( int ) RoleType.Member || ur.Role.Type == ( int ) RoleType.GymUser ) &&



                         // Custom Search
                         (
                            ( ( csm.Status != Status.All ) ? u.Status == ( int ) csm.Status : true ) &&
                            ( ( csm.RoleType != RoleType.All ) ? u.UserRoles.Any( ur => ur.Role.Type == ( int ) csm.RoleType ) : true ) &&
                            ( ( csm.Province != Province.Any ) ? context.Addresses.Any( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Province == ( int ) csm.Province ) : true )
                         ) &&



                         // Normal Search
                         (
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Name ) || qs.All( q => u.Name.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Cell ) || qs.All( q => u.Cell.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Email ) || qs.All( q => u.Email.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.Surname ) || qs.All( q => u.Surname.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.JobTitle ) || qs.All( q => u.JobTitle.ToLower().Contains( q.ToLower() ) ) ) : true ) ||
                            ( qs.Any( q => q != "" ) ? ( qs.Contains( u.IdNumber ) || qs.All( q => u.IdNumber.ToLower().Contains( q.ToLower() ) ) ) : true )
                        )
                     )

                     #endregion

                     select u ).OrderBy( CreateOrderBy( pm.SortBy, pm.Sort ) )
                               .Skip( pm.Skip )
                               .Take( pm.Take )
                               .ToList();
        }

        /// <summary>
        /// Gets a simple list of users, usually useful in a custom search
        /// </summary>
        /// <param name="simple"></param>
        /// <returns></returns>
        public List<SimpleUserModel> List( bool simple = true )
        {
            return ( from u in context.Users
                     where
                     (
                        u.Status == ( int ) Status.Active
                     )
                     select new SimpleUserModel
                     {
                         Id = u.Id,
                         Name = u.Name,
                         Email = u.Email,
                         Surname = u.Surname,
                         IdNumber = u.IdNumber,
                         DisplayName = u.Name + " " + u.Surname,
                         Status = ( Status ) u.Status
                     } ).ToList();
        }

        /// <summary>
        /// Gets a simple list of users, usually useful in a custom search
        /// </summary>
        /// <param name="simple"></param>
        /// <returns></returns>
        public Dictionary<int, string> List( bool simple = true, RoleType roleType = RoleType.All )
        {
            Dictionary<int, string> userOptions = new Dictionary<int, string>();
            List<IntStringKeyValueModel> model = new List<IntStringKeyValueModel>();

            List<object> parameters = new List<object>();

            string query = string.Empty;

            query = $"SELECT u.Id AS [TKey], u.Name + ' ' + u.Surname AS [TValue] FROM [dbo].[User] u WHERE u.Status={( int ) Status.Active}";

            if ( roleType != RoleType.All )
            {
                query = $" {query} AND u.Type={( int ) roleType} ";
            }

            model = context.Database.SqlQuery<IntStringKeyValueModel>( query.Trim(), parameters.ToArray() ).ToList();

            if ( model != null && model.Any() )
            {
                foreach ( var k in model )
                {
                    if ( userOptions.Keys.Any( x => x == k.TKey ) )
                        continue;

                    userOptions.Add( k.TKey, ( k.TValue ?? "" ).Trim() );
                }
            }

            return userOptions;
        }

        /// <summary>
        /// Gets a list of leads record for the specified params
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public int Total1( PagingModel pm, CustomSearchModel csm )
        {
            string[] qs = ( csm.Query ?? "" ).Split( ' ' );

            if ( csm.FromDate.HasValue && csm.ToDate.HasValue && csm.FromDate?.Date == csm.ToDate?.Date )
            {
                csm.ToDate = csm.ToDate?.AddDays( 1 );
            }

            CountModel count = new CountModel();

            // Parameters

            #region Parameters

            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "skip", pm.Skip ) },
                { new SqlParameter( "take", pm.Take ) },
                { new SqlParameter( "userid", ( CurrentUser != null ) ? CurrentUser.Id : 0 ) },
                //{ new SqlParameter( "csmDeclineReasonId", csm.DeclineReasonId ) },
                { new SqlParameter( "query", csm.Query ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmToDate", csm.ToDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmFromDate", csm.FromDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmRoleType", ( int ) csm.RoleType ) },
                //{ new SqlParameter( "csmAgentStatus", ( int ) csm.AgentStatus ) },
                { new SqlParameter( "csmProvince", ( int ) csm.Province ) }
            };

            #endregion

            string query = string.Empty;

            query = string.Format( @"SELECT
	                                   COUNT(1) AS [Total]
                                     FROM 
	                                    [dbo].[User] u", query );

            // WHERE

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            #endregion

            // Custom Search

            #region Custom Search

            //if ( csm.DeclineReasonId != 0 )
            //{
            //    query = $"{query} AND (u.DeclineReasonId=@csmDeclineReasonId) ";
            //}
            if ( csm.RoleType != RoleType.All )
            {
                query = $"{query} AND (u.Type=@csmRoleType) ";
            }
            if ( csm.Status != Status.All )
            {
                query = $"{query} AND (u.Status=@csmAgentStatus) ";
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = $"{query} AND (u.CreatedOn >= @csmFromDate AND u.CreatedOn <= @csmToDate) ";
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = $"{query} AND (u.CreatedOn>=@csmFromDate) ";
                }
                if ( csm.ToDate.HasValue )
                {
                    query = $"{query} AND (u.CreatedOn<=@csmToDate) ";
                }
            }
            if ( csm.Province != Province.All )
            {
                query = $"{query} AND EXISTS(SELECT 1 FROM [dbo].[Address] a WHERE a.ObjectId=u.Id AND a.ObjectType='User' AND a.Province=@csmProvince) ";
            }

            #endregion

            // Normal Search

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (u.Name LIKE '%{1}%' OR
                                                  u.Surname LIKE '%{1}%' OR
                                                  u.IdNumber LIKE '%{1}%' OR
                                                  u.TaxNumber LIKE '%{1}%' OR
                                                  u.Email LIKE '%{1}%' OR
                                                  u.Cell LIKE '%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            count = context.Database.SqlQuery<CountModel>( query.Trim(), parameters.ToArray() ).FirstOrDefault();

            return count.Total;
        }

        /// <summary>
        /// Gets a list of leads record for the specified params
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public List<UserModel> List1( PagingModel pm, CustomSearchModel csm )
        {
            string[] qs = ( csm.Query ?? "" ).Split( ' ' );

            if ( csm.FromDate.HasValue && csm.ToDate.HasValue && csm.FromDate?.Date == csm.ToDate?.Date )
            {
                csm.ToDate = csm.ToDate?.AddDays( 1 );
            }

            List<UserModel> list, final = new List<UserModel>();

            // Parameters

            #region Parameters

            List<object> parameters = new List<object>()
            {
                { new SqlParameter( "skip", pm.Skip ) },
                { new SqlParameter( "take", pm.Take ) },
                { new SqlParameter( "userid", ( CurrentUser != null ) ? CurrentUser.Id : 0 ) },
                //{ new SqlParameter( "csmDeclineReasonId", csm.DeclineReasonId ) },
                { new SqlParameter( "query", csm.Query ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmToDate", csm.ToDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmFromDate", csm.FromDate ?? ( object ) DBNull.Value ) },
                { new SqlParameter( "csmRoleType", ( int ) csm.RoleType ) },
                //{ new SqlParameter( "csmAgentStatus", ( int ) csm.AgentStatus ) },
                { new SqlParameter( "csmProvince", ( int ) csm.Province ) }
            };

            #endregion

            string query = string.Empty;

            query = string.Format( @"SELECT
	                                   u.*,
                                       (SELECT TOP 1 a.Province FROM [dbo].[Address] a WHERE a.ObjectId=u.Id AND a.ObjectType='User') AS [Province],
                                       (SELECT COUNT(1) FROM [dbo].[Lead] l WHERE l.AgentUserId=u.Id) AS [LeadCount],
                                       (SELECT COUNT(1) FROM [dbo].[Comment] c WHERE c.ObjectId=u.Id AND c.ObjectType='User') AS [CommentCount]
                                     FROM 
	                                    [dbo].[User] u", query );

            // WHERE

            #region WHERE

            query = $"{query} WHERE (1=1) ";

            #endregion

            // Custom Search

            #region Custom Search

            //if ( csm.DeclineReasonId != 0 )
            //{
            //    query = $"{query} AND (u.DeclineReasonId=@csmDeclineReasonId) ";
            //}
            if ( csm.RoleType != RoleType.All )
            {
                query = $"{query} AND (u.Type=@csmRoleType) ";
            }
            if ( csm.Status != Status.All )
            {
                query = $"{query} AND (u.Status=@csmAgentStatus) ";
            }
            if ( csm.FromDate.HasValue && csm.ToDate.HasValue )
            {
                query = $"{query} AND (u.CreatedOn >= @csmFromDate AND u.CreatedOn <= @csmToDate) ";
            }
            else if ( csm.FromDate.HasValue || csm.ToDate.HasValue )
            {
                if ( csm.FromDate.HasValue )
                {
                    query = $"{query} AND (u.CreatedOn>=@csmFromDate) ";
                }
                if ( csm.ToDate.HasValue )
                {
                    query = $"{query} AND (u.CreatedOn<=@csmToDate) ";
                }
            }
            if ( csm.Province != Province.All )
            {
                query = $"{query} AND EXISTS(SELECT 1 FROM [dbo].[Address] a WHERE a.ObjectId=u.Id AND a.ObjectType='User' AND a.Province=@csmProvince) ";
            }

            #endregion

            // Normal Search

            #region Normal Search

            if ( !string.IsNullOrEmpty( csm.Query ) )
            {
                query = string.Format( @"{0} AND (u.Name LIKE '%{1}%' OR
                                                  u.Surname LIKE '%{1}%' OR
                                                  u.IdNumber LIKE '%{1}%' OR
                                                  u.TaxNumber LIKE '%{1}%' OR
                                                  u.Email LIKE '%{1}%' OR
                                                  u.Cell LIKE '%{1}%'
                                             ) ", query, csm.Query.Trim() );
            }

            #endregion

            // ORDER

            query = string.Format( "{0} ORDER BY {1} {2} ", query, pm.SortBy, pm.Sort );

            // SKIP, TAKE

            query = string.Format( "{0} OFFSET (@skip) ROWS FETCH NEXT (@take) ROWS ONLY ", query );

            list = context.Database.SqlQuery<UserModel>( query.Trim(), parameters.ToArray() ).ToList();

            if ( list != null && list.Any() )
            {
                foreach ( UserModel agent in list )
                {
                    agent.Images = context.Images.Where( i => i.ObjectId == agent.Id && i.ObjectType == "User" ).ToList();
                }
            }

            return list;
        }

        /// <summary>
        /// Checks if a user with the specified id number already exists?
        /// </summary>
        /// <param name="idNumber"></param>
        /// <returns></returns>
        public bool ExistByIdNumber( string idNumber )
        {
            return context.Users.Any( u => u.IdNumber == idNumber && u.Status == ( int ) Status.Active );
        }

        /// <summary>
        /// Checks if a user with the specified email already exists?
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public bool ExistByEmail( string email )
        {
            return context.Users.Any( u => u.Email == email && u.Status == ( int ) Status.Active );
        }

        /// <summary>
        /// Checks if a user with the specified Tax Number already exists?
        /// </summary>
        /// <param name="taxNumber"></param>
        /// <returns></returns>
        public bool ExistByTaxNumber( string taxNumber )
        {
            return context.Users.Any( u => u.TaxNumber == taxNumber && u.Status == ( int ) Status.Active );
        }

        /// <summary>
        /// Creates a new user
        /// </summary>
        /// <param name="user">An instance of a user to be created</param>
        /// <returns></returns>
        public User Create( User user, int roleId )
        {
            #region Role

            if ( roleId != 0 )
            {
                // Add the new selected
                UserRole role = new UserRole()
                {
                    RoleId = roleId,
                    UserId = user.Id,
                    Status = ( int ) Status.Active,
                    CreatedOn = DateTime.Now
                };

                user.UserRoles.Add( role );
            }

            #endregion

            return base.Create( user );
        }

        /// <summary>
        /// Updates an existing user
        /// </summary>
        /// <param name="user">An instance of a user to be updated</param>
        /// <returns></returns>
        public User Update( User user, int roleId = 0 )
        {
            #region Role

            if ( roleId != 0 && !user.UserRoles.Any( ur => ur.RoleId == roleId ) )
            {
                if ( user.UserRoles != null && user.UserRoles.Any() && !user.UserRoles.Any( ur => ur.RoleId == roleId ) )
                {
                    // Quickly Remove current role (s)
                    string query = string.Format( "DELETE FROM [UserRole] WHERE [Id] IN ({0});", string.Join<Int32>( ",", user.UserRoles.Select( ur => ur.Id ) ) );

                    bool success = Query( query );
                }

                // Add the new selected
                UserRole role = new UserRole()
                {
                    RoleId = roleId,
                    UserId = user.Id,
                    Status = ( int ) Status.Active,
                    CreatedOn = DateTime.Now
                };

                user.UserRoles = user.UserRoles ?? new List<UserRole>();

                user.UserRoles.Add( role );
            }

            #endregion

            return base.Update( user );
        }
    }
}
