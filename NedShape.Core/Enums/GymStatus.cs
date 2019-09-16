
namespace NedShape.Core.Enums
{
    using Attributes;

    [StringEnum]
    public enum GymStatus
    {
        [UiIgnoreEnumValue]
        [StringEnumDisplayText( "All" )]
        All = -1,

        [StringEnumDisplayText( "Inactive" )]
        Inactive = 0,

        [StringEnumDisplayText( "Active" )]
        Active = 1,

        [StringEnumDisplayText( "Pending" )]
        Pending = 2,
    }
}
