using System;
using System.Configuration;
using System.Web.Security;
using NedShape.Core.Services;
using NedShape.Data.Models;

namespace NedShape.Core.Extension
{
    public static class ConfigSettings
    {
        #region Properties

        public static TimeSpan FormsTimeOut
        {
            get
            {
                TimeSpan timeout = FormsAuthentication.Timeout;

                return timeout;
            }
        }

        public static int MaxMailsToProcess
        {
            get
            {
                string maxMailsToProcess = ConfigurationManager.AppSettings[ "MaxMailsToProcess" ] ?? "1";
                int mails = int.TryParse( maxMailsToProcess, out mails ) ? mails : 1;

                return mails; 
            }
        }

        public static string AdminEmailAddress
        {
            get
            {
                return ConfigurationManager.AppSettings[ "AdminEmailAddress" ] ?? "msimwaba@gmail.com";
            }
        }

        public static int PagingTake
        {
            get
            {
                string take = ConfigurationManager.AppSettings[ "PagingTake" ] ?? "50";
                int limit = int.TryParse( take, out limit ) ? limit : 50;

                return limit;
            }
        }

        public static SystemConfig SystemRules { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public static string AdminEmailAddress1
        {
            get
            {
                return ConfigurationManager.AppSettings[ "AdminEmailAddress1" ] ?? "msimwaba@gmail.com";
            }
        }

        /// <summary>
        /// 
        /// </summary>
        public static string AdminEmailAddress2
        {
            get
            {
                return ConfigurationManager.AppSettings[ "AdminEmailAddress2" ] ?? "dsouchon@gmail.com";
            }
        }

        /// <summary>
        /// 
        /// </summary>
        public static string AdminEmailAddress3
        {
            get
            {
                return ConfigurationManager.AppSettings[ "AdminEmailAddress3" ] ?? "heather.sadie@etechsolutions.co.za";
            }
        }
        
        #endregion

        /// <summary> 
        /// Gets the system rules
        /// </summary>
        /// <returns></returns>
        public static bool SetRules()
        {
            SystemRules = ( SystemConfig ) ContextExtensions.GetCachedData( "SR_ca" );

            if ( SystemRules != null )
            {
                return true;
            }

            using ( SystemConfigService service = new SystemConfigService() )
            {
                SystemRules = @service.List()[ 0 ] ?? new SystemConfig();

                ContextExtensions.CacheData( "SR_ca", SystemRules );
            }
            
            return true;
        }
    }
}