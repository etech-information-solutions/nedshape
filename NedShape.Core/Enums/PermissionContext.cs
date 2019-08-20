using System;
using NedShape.Core.Attributes;

namespace NedShape.Core.Enums
{
    // TODO:  Complete this list and keep in sync with DB script.
    [StringEnum]
    public enum PermissionContext
    {
        // Admin can see Admin (or Everything!)
        [PermissionContextSupports( PermissionTo.View )]
        SystemAdministrator,

        // Admin can see Admin (or Everything!)
        [PermissionContextSupports( PermissionTo.View )]
        Administration,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Finance )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Finance,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.AuthFin )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        AuthFin,

        // WebMaster can see WebMaster (or Everything!)
        [PermissionContextSupports( PermissionTo.View )]
        WebMaster,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Dummy )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Dummy,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.DashBoard )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        DashBoard,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Client )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Client,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Product )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Product,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Member )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Member,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Gym )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Gym,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Report )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Report,

        // Whatever else.
    }



    #region Attributes

    [AttributeUsage( AttributeTargets.Field, Inherited = false, AllowMultiple = false )]
    public class PermissionContextSupportsAttribute : Attribute
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="permissionTo">Flagged enumerator indicated the supported Permissions</param>
        public PermissionContextSupportsAttribute( PermissionTo permissionTo )
        {
            this.PermissionTo = permissionTo;
        }

        public PermissionTo PermissionTo { get; set; }
    }

    [AttributeUsage( AttributeTargets.Field, Inherited = false, AllowMultiple = true )]
    public class PermissionPrerequisiteAttribute : Attribute
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="requiring">Requiring Permission.  Can be flagged.</param>
        /// <param name="required">Required Permission. Cannot be flagged.</param>
        public PermissionPrerequisiteAttribute( PermissionTo requiring, PermissionTo required )
        {
            this.Requiring = requiring;
            this.Required = required;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="requiring">Requiring Permission.  Can be flagged.</param>
        /// <param name="required">Required Permission. Cannot be flagged.</param>
        /// <param name="requiredWithin"></param>
        public PermissionPrerequisiteAttribute( PermissionTo requiring, PermissionTo required, PermissionContext requiredWithin )
        {
            this.Requiring = requiring;
            this.Required = required;
            this.RequiredWithin = requiredWithin;
        }

        public PermissionPrerequisiteAttribute( PermissionTo required, PermissionContext requiredWithin )
        {
            this.Required = required;
            this.RequiredWithin = requiredWithin;
        }

        public PermissionTo? Requiring { get; set; }

        public PermissionTo Required { get; set; }

        public PermissionContext? RequiredWithin { get; set; }
    }

    [AttributeUsage( AttributeTargets.Field, Inherited = false, AllowMultiple = false )]
    public class ForcePermissionAttribute : Attribute
    {
        public ForcePermissionAttribute( PermissionTo permissionTo )
        {
            this.PermissionTo = permissionTo;
        }

        public PermissionTo PermissionTo { get; set; }
    }

    #endregion

    #region Extensions



    #endregion
}
