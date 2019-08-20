
namespace NedShape.Core.Enums
{
    using Attributes;

    [StringEnum]
    public enum DeclineReason
    {
        [UiIgnoreEnumValue]
        [StringEnumDisplayText( "All" )]
        All = -1,

        [StringEnumDisplayText( "Insufficient Funds" )]
        InsufficientFunds = 0,

        [StringEnumDisplayText( "Not Strategic" )]
        NotStrategic = 1,

        [StringEnumDisplayText( "Not Planned" )]
        NotPlanned = 2,

        [StringEnumDisplayText( "Planned for later" )]
        PlannedForLater = 3,

        [StringEnumDisplayText( "Unnecessary spend" )]
        UnnecessarySpend = 4,

        [StringEnumDisplayText( "Did not follow correct procedure" )]
        IncorrectProcedure = 5,

        [StringEnumDisplayText( "Not approved supplier" )]
        NotApprovedSupplier = 6,

        [StringEnumDisplayText( "No Funding available" )]
        NoFundingAvailable = 7,

        [StringEnumDisplayText( "Other" )]
        Other = 8,

        [StringEnumDisplayText( "Cancelled" )]
        Cancelled = 9
    }
}
