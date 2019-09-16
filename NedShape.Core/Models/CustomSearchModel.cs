using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;
using NedShape.Core.Services;
using NedShape.Data.Models;
using System.Reflection;

namespace NedShape.Core.Models
{
    public class CustomSearchModel
    {
        public CustomSearchModel()
        {
            SetDefaults();
        }



        #region Properties

        /// <summary>
        /// Can be used as a selected user 
        /// </summary>
        [Display( Name = "User" )]
        public int UserId
        {
            get; set;
        }

        /// <summary>
        /// Can be used as a selected gym service 
        /// </summary>
        [Display( Name = "Service" )]
        public int ServiceId
        {
            get; set;
        }

        /// <summary>
        /// Can be used for a Start date range
        /// </summary>
        [Display( Name = "From Date" )]
        public DateTime? FromDate
        {
            get; set;
        }

        /// <summary>
        /// Can be used for a End date range
        /// </summary>
        [Display( Name = "To" )]
        public DateTime? ToDate
        {
            get; set;
        }

        /// <summary>
        /// Can be used for any entity requiring bank filter
        /// </summary>
        [Display( Name = "Bank" )]
        public int BankId
        {
            get; set;
        }

        /// <summary>
        /// Can be used for any entity requiring bank account type filter
        /// </summary>
        [Display( Name = "Account Type" )]
        public BankAccountType AccountType
        {
            get; set;
        }

        /// <summary>
        /// Can be used to determine if VAT is applicable
        /// </summary>
        [Display( Name = "VAT" )]
        public YesNo VAT
        {
            get; set;
        }

        /// <summary>
        /// Can be used to indicate Activity Type
        /// </summary>
        [Display( Name = "Activity" )]
        public ActivityTypes ActivityType
        {
            get; set;
        }

        /// <summary>
        /// Can be used to indicate Role Type
        /// </summary>
        [Display( Name = "Role Type" )]
        public RoleType RoleType
        {
            get; set;
        }

        /// <summary>
        /// Can be used to indicate Role Type
        /// </summary>
        [Display( Name = "Role Type" )]
        public RoleType RoleType1
        {
            get; set;
        }

        /// <summary>
        /// Can be used to indicate Province
        /// </summary>
        [Display( Name = "Province" )]
        public Province Province
        {
            get; set;
        }

        /// <summary>
        /// A custom search query
        /// </summary>
        [Display( Name = "Search Text" )]
        public string Query
        {
            get; set;
        }

        /// <summary>
        /// Approved
        /// </summary>
        [Display( Name = "Approved" )]
        public bool? Approved
        {
            get; set;
        }

        /// <summary>
        /// Status
        /// </summary>
        [Display( Name = "Status" )]
        public Status Status
        {
            get; set;
        }

        /// <summary>
        /// Gym Status
        /// </summary>
        [Display( Name = "Gym Status" )]
        public GymStatus GymStatus
        {
            get; set;
        }

        [Display( Name = "Target Table" )]
        public string TableName
        {
            get; set;
        }

        [Display( Name = "Controller Name" )]
        public string ControllerName
        {
            get; set;
        }

        /// <summary>
        /// !SYSTEM: This is automatically set depending on page you're currently viewing
        /// </summary>
        public string ReturnView
        {
            get; set;
        }

        /// <summary>
        /// !SYSTEM: This is automatically set depending on page you're currently viewing
        /// </summary>
        public string Controller
        {
            get; set;
        }

        #endregion



        #region Model Options

        public List<SimpleUserModel> UserOptions
        {
            get; set;
            //get
            //{
            //    using ( UserService service = new UserService() )
            //    {
            //        return service.List( true );
            //    }
            //}
        }

        public Dictionary<int, string> ServiceOptions
        {
            get; set;
        }

        public List<Bank> BankOptions
        {
            get
            {
                using ( BankService service = new BankService() )
                {
                    return service.List();
                }
            }
            set
            {
            }
        }

        public List<string> TableNameOptions
        {
            get
            {
                return Assembly.Load( "NedShape.Data" )
                               .GetTypes()
                               .Where( a => string.Equals( a.Namespace, "NedShape.Data.Models", StringComparison.Ordinal ) )
                               .Select( s => s.Name )
                               .ToList();
            }
        }

        public List<string> ControllerNameOptions
        {
            get
            {
                return MvcHelper.GetControllerNames();
            }
        }

        #endregion



        /// <summary>
        /// There's a common use for Branch, DirectorateProject and DepartmentSubProject  etc
        /// This function will help generically retrieve a unique list of the above 3 from a specified table
        /// CAUTION!! Only use this if the table you're trying to query has the above 3 "string" columns and are spelled exactly as above!
        /// If the table doesn't have, then using this function will break your request, if not spelled the same, kindly make it spelled as
        /// above to enjoy me!
        /// LOOK at /Views/PaymentRequisition/_List and then /Views/Shared/_PRCustomSearch for usage
        /// </summary>
        /// <param name="listType"></param>
        public CustomSearchModel( string listType, bool isPRP = false )
        {
            SetDefaults();

            switch ( listType )
            {
                case "User":

                    #region User



                    #endregion

                    break;

                case "Gym":

                    #region Gym

                    using ( ServicesService sservice = new ServicesService() )
                    {
                        ServiceOptions = sservice.SimpleList();
                    }

                    #endregion

                    break;

                case "AuditLog":

                    #region Audit Log



                    #endregion

                    break;

                default:

                    break;
            }
        }



        private void SetDefaults()
        {
            Status = Status.All;
            Province = Province.Any;
            RoleType = RoleType.All;
            RoleType1 = RoleType.All;
            GymStatus = GymStatus.All;
            ActivityType = ActivityTypes.All;
            AccountType = BankAccountType.All;
        }
    }
}
