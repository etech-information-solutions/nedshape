using System.Web;
using System.Web.Caching;
using NedShape.Core.Models;
using NedShape.Core.Extension;

namespace NedShape.UI.Extensions
{
    public static class ContextExtensions
    {
        public static void CacheUser( this HttpContextBase context, UserModel user )
        {
            context.Cache.Insert( user.Email, user, null, Cache.NoAbsoluteExpiration, ConfigSettings.FormsTimeOut, CacheItemPriority.Default, null );
        }

        public static UserModel GetCachedUser( this HttpContextBase context )
        {
            UserModel user = GetCachedUser( context, context.User.Identity.Name );

            return user;
        }

        public static UserModel GetCachedUser( this HttpContextBase context, string userName )
        {
            UserModel user = context.Cache.Get( userName ) as UserModel;

            return user;
        }
    }
}
