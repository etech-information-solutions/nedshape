
namespace NedShape.Core.Enums
{
    using Attributes;

    [StringEnum]
    public enum Timers
    {
        [UiIgnoreEnumValue]
        [StringEnumDisplayText( "All" )]
        All = -1,

        [StringEnumDisplayText( "Political Report Timer" )]
        PoliticalReportTimer = 1,

        [StringEnumDisplayText( "Advancements Report Timer" )]
        AdvancementsReportTimer = 2,

        [StringEnumDisplayText( "Approved Branch Report Timer" )]
        ApprovedBranchReportTimer = 3,

        [StringEnumDisplayText( "Statutory Report Timer" )]
        StatutoryReportTimer = 4
    }
}
