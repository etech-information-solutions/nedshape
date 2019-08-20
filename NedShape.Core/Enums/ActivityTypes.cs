
namespace NedShape.Core.Enums
{
    using Attributes;

    [StringEnum]
    public enum ActivityTypes
    {
        [UiIgnoreEnumValue]
        All = -1,

        Login,

        Logout,

        List,

        View,

        Delete,

        CreateRequest,

        Create,

        EditRequest,

        Edit,

        AuthorizePayment,

        DeclinePayment,

        UploadDocument,

        Email,

        ImportBudget,

        GeneratePayment,

        UpdatePayment,

        RunPayments,

        RunGLReports,

        Open,

        Download,

        Other
    }
}

