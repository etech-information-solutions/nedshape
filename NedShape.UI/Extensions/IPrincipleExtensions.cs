using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NedShape.Core.Enums;
using NedShape.Core.Helpers;
using NedShape.Core.Services;
using NedShape.Core.Models;
using NedShape.Data.Models;
using System.Reflection;

namespace System
{
    public static class IPrincipleExtensions
    {
        /// <summary>
        /// Determines whether an IPrinciple has Permission to do something within a PermissionContext.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="permission"></param>
        /// <param name="within"></param>
        /// <returns></returns>
        public static bool Has( this System.Security.Principal.IPrincipal user, PermissionTo permission, PermissionContext within )
        {
            bool isInRole = false;

            foreach ( PermissionTo pt in EnumHelper.GetOptions<PermissionTo>() )
            {
                if ( permission.MatchesFilter( pt ) )
                {
                    isInRole = user.IsInRole( string.Format( "{0}_{1}", within.GetStringValue(), pt.GetStringValue() ) );

                    if ( isInRole )
                    {
                        break;
                    }
                }
            }

            return isInRole;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="within"></param>
        /// <returns></returns>
        public static bool Has( this System.Security.Principal.IPrincipal user, PermissionContext within )
        {
            bool hasRole = false;

            using ( UserService service = new UserService() )
            {
                UserModel _user = service.GetUser( user.Identity.Name );

                hasRole = ( _user != null && _user.RoleModel.Name == within.GetStringValue() ) ? true : false;
            }

            return hasRole;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="within"></param>
        /// <returns></returns>
        public static UserModel Get( this System.Security.Principal.IPrincipal user )
        {
            UserModel _user;

            using ( UserService service = new UserService() )
            {
                _user = service.GetUser( user.Identity.Name );
            }

            return _user;
        }
    }
}