
namespace NedShape.Core.Enums
{
    using Attributes;

    [StringEnum]
    public enum RoleType
    {
        [UiIgnoreEnumValue]
        [StringEnumDisplayText( "All / NA" )]
        All = -1,

        [StringEnumDisplayText( "Gym Member" )]
        Member = 1,

        [StringEnumDisplayText( "Gym User" )]
        GymUser = 2,

        [StringEnumDisplayText( "Financial User" )]
        FinancialUser = 3,

        [StringEnumDisplayText( "System Operator" )]
        SystemOperator = 4,

        [StringEnumDisplayText( "System Administrator" )]
        SystemAdministrator = 5
    }
}
