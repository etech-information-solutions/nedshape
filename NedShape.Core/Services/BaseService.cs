using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Transactions;
using NedShape.Core.Enums;
using NedShape.Core.Models;
using NedShape.Data.Models;
using NedShape.Core.Interfaces;
using NedShape.Core.Extension;

namespace NedShape.Core.Services
{
    public class BaseService<T> : IDisposable, IEntity<T> where T : class
    {
        private bool disposing = false;

        internal NedShapeEntities context = new NedShapeEntities();

        private UserModel _currentUser;

        public int ItemId { get; set; }

        public SystemConfig Config
        {
            get
            {
                SystemConfig c = ( SystemConfig ) ContextExtensions.GetCachedData( "SR_ca" );

                if ( c != null ) return c;

                c = context.SystemConfigs.FirstOrDefault();

                ContextExtensions.CacheData( "SR_ca", c );

                return c;
            }
        }

        /// <summary>
        /// Currently logged in user
        /// </summary>
        public UserModel CurrentUser
        {
            get
            {
                if ( HttpContext.Current == null )
                    return null;
                //return new UserModel() { Id = 1 };

                string email = ( _currentUser != null && !string.IsNullOrEmpty( _currentUser.Email ) ) ? _currentUser.Email : HttpContext.Current.User.Identity.Name;

                UserModel user = ContextExtensions.GetCachedUserData( email ) as UserModel;

                if ( user == null )
                {
                    user = GetUser( email );
                }

                _currentUser = user ?? new UserModel() { Id = 0 };

                return _currentUser;
            }
        }

        /// <summary>
        /// Stores an entity's state before changes are made to it...
        /// </summary>
        public T OldObject { get; set; }

        public BaseService()
        {
            context.Configuration.LazyLoadingEnabled = false;
            context.Configuration.ProxyCreationEnabled = false;
        }

        /// <summary>
        /// Gets a user using the specified Email Address and Password and populates necessary roles
        /// </summary>
        /// <param name="email">Email Address of the user to be fetched</param>
        /// <param name="password">Password of the user to be fetched</param>
        /// <returns></returns>
        public UserModel Login( string email, string password )
        {
            if ( string.IsNullOrEmpty( email ) || string.IsNullOrEmpty( password ) ) return null;

            UserModel model = new UserModel();

            password = GetSha1Md5String( password );

            model = ( from u in context.Users
                      where
                      (
                        u.Email.Trim() == email.Trim() &&
                        u.Password.Trim() == password &&
                        u.Status == ( int ) Status.Active
                      )
                      select new UserModel()
                      {
                          Id = u.Id,
                          Cell = u.Cell,
                          Name = u.Name,
                          Email = u.Email,
                          Surname = u.Surname,
                          JobTitle = u.JobTitle,
                          CreatedOn = u.CreatedOn,
                          IdNumber = u.IdNumber.Trim(),
                          TaxNumber = u.TaxNumber,
                          IsSAId = u.IsSAId,
                          Status = ( Status ) u.Status,
                          DisplayName = u.Name + " " + u.Surname,
                          NiceCreatedOn = u.CreatedOn,
                          DateOfBirth = u.DateOfBirth,
                          IsAdmin = u.UserRoles.Any( ur => ur.Role.Administration && ur.Status == ( int ) Status.Active ),
                          Roles = u.UserRoles.Where( ur => ur.Status == ( int ) Status.Active )
                                             .Select( ur => ur.Role )
                                             .OrderByDescending( r => r.Id )
                                             .ToList(),
                          Addresses = context.Addresses
                                             .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" )
                                             .ToList(),
                          LogoUrl = context.Images
                                          .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Name.ToLower() == "logo" )
                                          .Select( s => VariableExtension.SystemRules.ImagesLocation + "//" + s.Location ).FirstOrDefault(),
                          BrochureUrl = context.Images
                                          .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Name.ToLower() == "brochure" )
                                          .Select( s => VariableExtension.SystemRules.ImagesLocation + "//" + s.Location ).FirstOrDefault(),
                          ContractUrl = context.Images
                                          .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Name.ToLower() == "contract" )
                                          .Select( s => VariableExtension.SystemRules.ImagesLocation + "//" + s.Location ).FirstOrDefault(),

                          /*BankDetail = new BankDetailModel()
                          {
                              Account = u.BankDetails.FirstOrDefault().Account,
                              AccountType = u.BankDetails.FirstOrDefault().AccountType,
                              BankId = u.BankDetails.FirstOrDefault().BankId,
                              Beneficiary = u.BankDetails.FirstOrDefault().Beneficiary,
                              Branch = u.BankDetails.FirstOrDefault().Branch,
                              Id = u.BankDetails.FirstOrDefault().Id
                          }*/
                      } ).FirstOrDefault();

            if ( model != null )
            {
                // Get roles
                model = this.ConfigRoles( model );

                User user = context.Users.FirstOrDefault( u => u.Id == model.Id );

                user.LastLogin = DateTime.Now;

                context.Entry( user ).State = EntityState.Modified;
                context.SaveChanges();

                ContextExtensions.CacheUserData( model.Email, model );
            }

            return model;
        }

        /// <summary>
        /// Gets a user using the specified ID and populates the necessary roles
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public UserModel GetUser( string email )
        {
            if ( String.IsNullOrEmpty( email ) ) return null;

            UserModel model = new UserModel();

            model = ( from u in context.Users
                      where
                      (
                        u.Email == email &&
                        u.Status == ( int ) Status.Active
                      )
                      select new UserModel()
                      {
                          Id = u.Id,
                          Cell = u.Cell,
                          Name = u.Name,
                          Email = u.Email,
                          Surname = u.Surname,
                          JobTitle = u.JobTitle,
                          CreatedOn = u.CreatedOn,
                          IdNumber = u.IdNumber.Trim(),
                          TaxNumber = u.TaxNumber,
                          IsSAId = u.IsSAId,
                          Status = ( Status ) u.Status,
                          DisplayName = u.Name + " " + u.Surname,
                          NiceCreatedOn = u.CreatedOn,
                          DateOfBirth = u.DateOfBirth,
                          IsAdmin = u.UserRoles.Any( ur => ur.Role.Administration && ur.Status == ( int ) Status.Active ),
                          Roles = u.UserRoles.Where( ur => ur.Status == ( int ) Status.Active )
                                             .Select( ur => ur.Role )
                                             .OrderByDescending( r => r.Id )
                                             .ToList(),
                          Addresses = context.Addresses
                                             .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" )
                                             .ToList(),
                          LogoUrl = context.Images
                                          .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Name.ToLower() == "logo" )
                                          .Select( s => VariableExtension.SystemRules.ImagesLocation + "//" + s.Location ).FirstOrDefault(),
                          BrochureUrl = context.Images
                                          .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Name.ToLower() == "brochure" )
                                          .Select( s => VariableExtension.SystemRules.ImagesLocation + "//" + s.Location ).FirstOrDefault(),
                          ContractUrl = context.Images
                                          .Where( a => a.ObjectId == u.Id && a.ObjectType == "User" && a.Name.ToLower() == "contract" )
                                          .Select( s => VariableExtension.SystemRules.ImagesLocation + "//" + s.Location ).FirstOrDefault(),

                          /*BankDetail = new BankDetailModel()
                          {
                              Account = u.BankDetails.FirstOrDefault().Account,
                              AccountType = u.BankDetails.FirstOrDefault().AccountType,
                              BankId = u.BankDetails.FirstOrDefault().BankId,
                              Beneficiary = u.BankDetails.FirstOrDefault().Beneficiary,
                              Branch = u.BankDetails.FirstOrDefault().Branch,
                              Id = u.BankDetails.FirstOrDefault().Id
                          }*/
                      } ).FirstOrDefault();


            if ( model != null )
            {
                // Get roles
                model = this.ConfigRoles( model );
            }

            return model;
        }

        /// <summary>
        /// Configures the specified user's roles
        /// </summary>
        /// <param name="user"></param> 
        /// <returns></returns>
        public UserModel ConfigRoles( UserModel model )
        {
            // Role
            Role r = model.Roles.FirstOrDefault();

            model.Role = r;
            model.RoleType = ( RoleType ) r.Type;
            model.IsAdmin = ( r.Type == ( int ) RoleType.SystemAdministrator );

            RoleModel role = new RoleModel()
            {
                Name = r.Name,
                Permissions = new List<PermissionModel>()
            };

            Dictionary<string, object> permissions = r.GetType()
                                                      .GetProperties()
                                                      .ToDictionary( prop => prop.Name, prop => prop.GetValue( r, null ) );

            // permissions.Add( "DashBoard", true );

            int count = 1;

            foreach ( string key in permissions.Keys )
            {
                // If this cannot be parsed, then it's another [Role].[Property]
                // We're only look for: 
                // [DashBoard], [PaymentRequisition], [Authorisation], [Finance], [Supplier], [Report], [Administration]
                if ( !Enum.TryParse( key, out PermissionContext pContext ) ) continue;

                if ( permissions[ key ] == null ) continue;

                bool.TryParse( permissions[ key ].ToString(), out bool hasAccess );

                if ( !hasAccess ) continue;

                role.Permissions.Add( new PermissionModel() { Id = count, PermissionContext = pContext, PermissionTo = PermissionTo.View, RoleId = r.Id } );

                role.Permissions.Add( new PermissionModel() { Id = count, PermissionContext = pContext, PermissionTo = PermissionTo.Create, RoleId = r.Id } );
                role.Permissions.Add( new PermissionModel() { Id = count, PermissionContext = pContext, PermissionTo = PermissionTo.Edit, RoleId = r.Id } );
                role.Permissions.Add( new PermissionModel() { Id = count, PermissionContext = pContext, PermissionTo = PermissionTo.Delete, RoleId = r.Id } );

                count++;
            }

            model.RoleModel = role;

            return model;
        }

        /// <summary>
        /// Determines if a logged in user has Admin Rights...?
        /// </summary>
        /// <returns></returns>
        public bool UserHasAdminRights()
        {
            return ( CurrentUser.RoleType == RoleType.SystemAdministrator || CurrentUser.RoleType == RoleType.SystemOperator );
        }

        /// <summary>
        /// Determines if a logged in user has Finance Rights...?
        /// </summary>
        /// <returns></returns>
        public bool UserHasFinanceRights()
        {
            return CurrentUser.RoleType == RoleType.SystemAdministrator || CurrentUser.RoleType == RoleType.FinancialUser;
        }

        /// <summary>
        /// Applies SHA1 and then MD5 to a given string
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public string GetSha1Md5String( string input )
        {
            SHA1 sha1 = new SHA1CryptoServiceProvider();
            byte[] result = sha1.ComputeHash( Encoding.UTF8.GetBytes( input ) );

            using ( MD5 md5 = MD5.Create() )
            {
                // Create a new Stringbuilder to collect the bytes 
                // and create a string.
                StringBuilder sBuilder = new StringBuilder();

                // Loop through each byte of the hashed data  
                // and format each one as a hexadecimal string. 
                for ( int i = 0; i < result.Length; i++ )
                {
                    sBuilder.Append( result[ i ].ToString( "x2" ) );
                }

                input = sBuilder.ToString();
            }

            return input;
        }

        /// <summary>
        /// Adds tracking information/properties to an entity
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public T Track( T item, bool isUpdate = false )
        {
            var properties = item.GetType().GetProperties();

            for ( int i = 0; i < properties.Length; i++ )
            {
                if ( isUpdate && properties[ i ].Name == "CreatedOn" ) continue;

                if ( !isUpdate && ( properties[ i ].Name == "CreatedOn" ) )
                {
                    properties[ i ].SetValue( item, DateTime.Now, null );
                }
                if ( !isUpdate && ( properties[ i ].Name == "CreatedBy" ) )
                {
                    properties[ i ].SetValue( item, ( ( CurrentUser != null && CurrentUser.Id != 0 ) ? CurrentUser.Id : 0 ), null );
                }
                if ( properties[ i ].Name == "ModifiedOn" )
                {
                    properties[ i ].SetValue( item, DateTime.Now, null );
                }
                if ( properties[ i ].Name == "ModifiedBy" )
                {
                    properties[ i ].SetValue( item, ( ( CurrentUser != null && CurrentUser.Id != 0 ) ? CurrentUser.Id : 0 ), null );
                }

                // TRIM all strings
                if ( properties[ i ].PropertyType == typeof( string ) )
                {
                    string value = ( string ) properties[ i ].GetValue( item );

                    properties[ i ].SetValue( item, value?.Trim(), null );
                }
            }

            ItemId = ( int ) properties.FirstOrDefault( i => i.Name == "Id" ).GetValue( item );

            return item;
        }

        /// <summary>
        /// Creates a Contains in the Where Clause
        /// </summary>
        /// <param name="csm"></param>
        /// <returns></returns>
        public virtual Expression<Func<T, bool>> ColumnContains( CustomSearchModel csm )
        {
            ParameterExpression item = Expression.Parameter( typeof( T ), "item" );

            Expression body = Expression.NotEqual( Expression.Property( item, "Id" ), Expression.Constant( 0 ) );

            List<System.Reflection.PropertyInfo> properties = typeof( T ).GetProperties().Where( p => p.PropertyType == typeof( string ) ).ToList();

            if ( !properties.Any() && !string.IsNullOrEmpty( ( csm.Query ?? "" ) ) )
            {
                body = Expression.AndAlso( body, properties.Select( p => ( Expression ) Expression.Call(
                          Expression.Property( item, p ), "Contains", Type.EmptyTypes, Expression.Constant( ( csm.Query ?? "" ) ) )
                       ).Aggregate( Expression.OrElse ) );
            }

            return Expression.Lambda<Func<T, bool>>( body, item );
        }

        /// <summary>
        /// Applies a generic column where clause in the specified table T
        /// </summary>
        /// <param name="column"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        private Expression<Func<T, bool>> ColumnWhere( string column, object value )
        {
            ParameterExpression itemParameter = Expression.Parameter( typeof( T ), "item" );

            Expression<Func<T, bool>> whereExpression = null;

            if ( value != null && typeof( T ).GetProperties().Any( p => p.Name == column ) )
            {
                whereExpression = Expression.Lambda<Func<T, bool>>
                    (
                    Expression.Equal( Expression.Property( itemParameter, column ), Expression.Constant( value ) ),
                    new[] { itemParameter }
                    );
            }
            else
            {
                // Fall back onto the Primary Key Id of the table. 
                // Make sure the table does have a column called Id though
                whereExpression = Expression.Lambda<Func<T, bool>>
                    (
                    Expression.NotEqual( Expression.Property( itemParameter, "Id" ), Expression.Constant( 0 ) ),
                    new[] { itemParameter }
                    );
            }

            return whereExpression;
        }

        /// <summary>
        /// Applies a generic column where clause in the specified table T
        /// </summary>
        /// <param name="columns"></param>
        /// <returns></returns>
        private Expression<Func<T, bool>> ColumnsWhere( Dictionary<string, object> columns )
        {
            ParameterExpression item = Expression.Parameter( typeof( T ), "item" );

            Expression body = Expression.NotEqual( Expression.Property( item, "Id" ), Expression.Constant( 0 ) );

            if ( columns != null && columns.Any() )
            {
                foreach ( KeyValuePair<string, object> column in columns )
                {
                    if ( column.Value != null && typeof( T ).GetProperties().Any( p => p.Name == column.Key ) )
                    {
                        body = Expression.And( body, Expression.Equal( Expression.Property( item, column.Key ), Expression.Constant( column.Value ) ) );
                    }
                }
            }

            return Expression.Lambda<Func<T, bool>>( body, item );
        }

        /// <summary>
        /// Creates a custom sorting
        /// </summary>
        /// <param name="sortBy"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public string CreateOrderBy( string sortBy, string sort )
        {
            sort = string.IsNullOrEmpty( sort ) ? "ASC" : sort;
            sortBy = string.IsNullOrEmpty( sortBy ) ? "Id" : sortBy;

            if ( !sortBy.Contains( "," ) )
            {
                return string.Format( "{0} {1}", sortBy, sort );
            }

            string[] sorts = sortBy.Split( ',' );

            sortBy = string.Empty;

            foreach ( string s in sorts )
            {
                sortBy = string.Format( "{0}{1} {2},", sortBy, s, sort );
            }

            sortBy = sortBy.Remove( sortBy.Length - 1, 1 );

            return sortBy;
        }



        /// <summary>
        /// Gets an entity using the specified id
        /// </summary>
        /// <param name="value">Id of the entity to be fetched</param>
        /// <returns></returns>
        public virtual T GetById( int id )
        {
            ParameterExpression itemParameter = Expression.Parameter( typeof( T ), "item" );
            var whereExpression = Expression.Lambda<Func<T, bool>>
                (
                Expression.Equal( Expression.Property( itemParameter, "Id" ), Expression.Constant( id ) ),
                new[] { itemParameter }
                );

            T item = context.Set<T>().Where( whereExpression ).FirstOrDefault();

            using ( NedShapeEntities db = new NedShapeEntities() )
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                OldObject = db.Set<T>().AsNoTracking().Where( whereExpression ).FirstOrDefault();
            }

            return item;
        }

        /// <summary>
        /// Gets a total count of records
        /// </summary>
        /// <returns></returns>
        public virtual int Total()
        {
            return context.Set<T>().Count();
        }

        /// <summary>
        /// Gets a list of the entities available
        /// </summary>
        /// <returns></returns>
        public virtual List<T> List()
        {
            return context.Set<T>().ToList();
        }

        /// <summary>
        /// Gets the maximum value in the generic T in the specified column
        /// </summary>
        /// <param name="column"></param>
        /// <returns></returns>
        public virtual object Max( string column )
        {
            return context.Set<T>()
                          .SelectString( column )
                          .Max();
        }

        /// <summary>
        /// Gets a total count of records using the specified search filters
        /// </summary>
        /// <returns></returns>
        public virtual int Total( PagingModel pm, CustomSearchModel csm )
        {
            string[] qs = ( pm.Query ?? "" ).Split( ' ' );

            var where = ColumnContains( csm );

            // TODO: Add some generic WHERE clause e.g string properties to contain above qs/query

            return context.Set<T>().Count( where );
        }

        /// <summary>
        /// Gets a list of the entities available using the specified search filters
        /// </summary>
        /// <param name="pm"></param>
        /// <param name="csm"></param>
        /// <returns></returns>
        public virtual List<T> List( PagingModel pm, CustomSearchModel csm )
        {
            var where = ColumnContains( csm );

            pm.Sort = ( string.IsNullOrEmpty( pm.Sort ) ) ? "ASC" : pm.Sort;
            pm.SortBy = ( string.IsNullOrEmpty( pm.SortBy ) ) ? "Id" : pm.SortBy;
            pm.Take = ( pm.Take.Equals( 0 ) ) ? ConfigSettings.PagingTake : pm.Take;

            return context.Set<T>()
                          .Where( where )
                          .OrderBy( CreateOrderBy( pm.SortBy, pm.Sort ) )
                          .Skip( pm.Skip )
                          .Take( pm.Take )
                          .ToList();
        }

        /// <summary>
        /// Gets a list of [select] for the specified table by generic T
        /// If the constraint column is defined then we'll apply it
        /// </summary>
        /// <param name="select"></param>
        /// <param name="select"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public List<string> ListByColumns( string select = "", Dictionary<string, object> columns = null )
        {
            return context.Set<T>()
                          .Where( ColumnsWhere( columns ) )
                          .SelectString( select )
                          .Distinct()
                          .ToList();
        }

        /// <summary>
        /// Gets a list of [select] for the specified table by generic T
        /// If the constraint column is defined then we'll apply it
        /// </summary>
        /// <param name="select"></param>
        /// <param name="select"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public List<string> ListByColumn( string select = "", string column = "", object value = null )
        {
            return context.Set<T>()
                          .Where( ColumnWhere( column, value ) )
                          .SelectString( select )
                          .Distinct()
                          .ToList();
        }

        /// <summary>
        /// Gets a list of [select] for the specified table by generic T
        /// If the constraint column is defined then we'll apply it
        /// </summary>
        /// <param name="select"></param>
        /// <param name="select"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public List<int> ListIntByColumn( string select = "", string column = "", object value = null )
        {
            return context.Set<T>()
                          .Where( ColumnWhere( column, value ) )
                          .SelectInt( select )
                          .Distinct()
                          .ToList();
        }

        /// <summary>
        /// Gets a string of [select] for the specified table by generic T
        /// If the constraint column is defined then we'll apply it
        /// </summary>
        /// <param name="select"></param>
        /// <param name="select"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public string GetByColumns( string select = "", Dictionary<string, object> columns = null )
        {
            return context.Set<T>()
                          .Where( ColumnsWhere( columns ) )
                          .SelectString( select )
                          .Distinct()
                          .FirstOrDefault();
        }

        /// <summary>
        /// Gets a String of [select] for the specified table by generic T
        /// If the constraint column is defined then we'll apply it
        /// </summary>
        /// <param name="select"></param>
        /// <param name="select"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public string GetByColumn( string select = "", string column = "", object value = null )
        {
            return context.Set<T>()
                          .Where( ColumnWhere( column, value ) )
                          .SelectString( select )
                          .Distinct()
                          .FirstOrDefault();
        }



        /// <summary>
        /// Deletes an existing entity
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public virtual bool Delete( T item )
        {
            using ( TransactionScope scope = new TransactionScope() )
            {
                if ( !context.ChangeTracker.Entries<T>().Any( e => e.Entity == item ) )
                {
                    context.Set<T>().Attach( item );
                }

                context.Set<T>().Remove( item );
                context.SaveChanges();

                scope.Complete();
            }

            using ( AuditLogService service = new AuditLogService() )
            {
                service.Create<T>( ActivityTypes.Delete, item, OldObject );
            }

            return true;
        }

        /// <summary>
        /// Creates a new entity
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public virtual T Create( T item )
        {
            System.Reflection.PropertyInfo[] properties = item.GetType().GetProperties();

            // Tracking
            item = Track( item );

            context.Set<T>().Add( item );

            context.SaveChanges();

            using ( AuditLogService service = new AuditLogService() )
            {
                service.Create<T>( ActivityTypes.Create, item );
            }

            return item;
        }

        /// <summary>
        /// Updates an existing entity
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public virtual T Update( T item )
        {
            // Tracking
            item = Track( item, true );

            context.Entry<T>( item ).State = EntityState.Modified;
            context.SaveChanges();

            using ( AuditLogService service = new AuditLogService() )
            {
                service.Create<T>( ActivityTypes.Edit, item, OldObject );
            }

            return item;
        }

        /// <summary>
        /// Executes a T-SQL against the database
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public virtual bool Query( string query, int timeout = 0 )
        {
            if ( string.IsNullOrEmpty( query ) ) return false;

            using ( NedShapeEntities context = new NedShapeEntities() )
            {
                if ( timeout > 0 )
                {
                    context.Database.CommandTimeout = timeout;
                }

                context.Database.ExecuteSqlCommand( query );
            }

            return true;
        }

        /// <summary>
        /// Formats the number depending on prefix and max
        /// </summary>
        /// <param name="prefix"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public string FormatNumber( string prefix, int max )
        {
            string number = string.Empty;

            // Reduce 
            if ( max < 10 )
            {
                number = string.Format( "{0}00000000{1}", prefix, max );
            }
            else if ( max >= 10 && max < 100 )
            {
                number = string.Format( "{0}0000000{1}", prefix, max );
            }
            else if ( max >= 100 && max < 1000 )
            {
                number = string.Format( "{0}000000{1}", prefix, max );
            }
            else if ( max >= 1000 && max < 10000 )
            {
                number = string.Format( "{0}00000{1}", prefix, max );
            }
            else if ( max >= 10000 && max < 100000 )
            {
                number = string.Format( "{0}0000{1}", prefix, max );
            }
            else if ( max >= 100000 && max < 1000000 )
            {
                number = string.Format( "{0}000{1}", prefix, max );
            }
            else if ( max >= 1000000 && max < 10000000 )
            {
                number = string.Format( "{0}00{1}", prefix, max );
            }
            else if ( max >= 10000000 && max < 100000000 )
            {
                number = string.Format( "{0}0{1}", prefix, max );
            }
            else if ( max >= 100000000 )
            {
                number = string.Format( "{0}{1}", prefix, max );
            }

            return number;
        }

        /// <summary>
        /// Gets the latest Lead Number
        /// </summary>
        /// <returns></returns>
        //public string GetLatestStatementNumber( string prefix )
        //{
        //    using ( StatementService service = new StatementService() )
        //    {
        //        // Get the current Max Statement number like so:
        //        string number = ( service.Max( "Number" ) as string ) ?? "0";

        //        int.TryParse( number.Trim().ToLower(), out int n );

        //        return $"{prefix}{( n + 1 )}";
        //    }
        //}


        public void Dispose()
        {
            this.disposing = true;
        }
    }
}
