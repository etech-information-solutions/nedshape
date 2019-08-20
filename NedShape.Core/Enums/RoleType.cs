
namespace NedShape.Core.Enums
{
    using Attributes;

    [StringEnum]
    public enum RoleType
    {
        [UiIgnoreEnumValue]
        [StringEnumDisplayText( "All / NA" )]
        All = 0,

        [UiIgnoreEnumValue]
        [StringEnumDisplayText( "Agent" )]
        Agent = 1,

        [StringEnumDisplayText( "Quality Assurer" )]
        QualityAssurer = 2,

        [StringEnumDisplayText( "Financial User" )]
        FinancialUser = 3,

        [StringEnumDisplayText( "Trading Partner" )]
        TradingPartner = 4,

        [StringEnumDisplayText( "System Operator" )]
        SystemOperator = 5,

        [StringEnumDisplayText( "System Administrator" )]
        SystemAdministrator = 6
    }
}
