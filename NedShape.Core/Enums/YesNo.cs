
namespace NedShape.Core.Enums
{
    using Attributes;

    [StringEnum]
    public enum YesNo
    {
        [StringEnumDisplayText( "All" )]
        All = -1,

        [StringEnumDisplayText( "Yes" )]
        Yes = 1,

        [StringEnumDisplayText( "No" )]
        No = 0,
    }
}
