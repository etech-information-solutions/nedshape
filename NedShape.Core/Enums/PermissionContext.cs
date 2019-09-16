using System;
using NedShape.Core.Attributes;

namespace NedShape.Core.Enums
{
    // TODO:  Complete this list and keep in sync with DB script.
    [StringEnum]
    public enum PermissionContext
    {
        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Dummy )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Dummy,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.DashBoard )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        DashBoard,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Clients )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Clients,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Services )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Services,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Members )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Members,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Profile )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Profile,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Gyms )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Gyms,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Reports )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Reports,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Statements )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Statements,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Financials )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Financials,

        [PermissionPrerequisite( PermissionTo.View, PermissionContext.Administration )]
        [PermissionContextSupports( PermissionTo.View | PermissionTo.Create | PermissionTo.Edit | PermissionTo.Delete )]
        Administration,

        // Whatever else.
        Administrator,

        Operator,

        Finance,

        Member,

        Gym
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
