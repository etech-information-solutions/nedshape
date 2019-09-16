using System;
using System.ComponentModel.DataAnnotations;
using NedShape.Core.Enums;

namespace NedShape.UI.Models
{
    public class GymTimeViewModel
    {
        #region Properties

        public int Id { get; set; }

        public int GymServiceId { get; set; }

        public YesNo OpenOnMonday { get; set; }
        public YesNo OpenOnTuesday { get; set; }
        public YesNo OpenOnWednesday { get; set; }
        public YesNo OpenOnThursday { get; set; }
        public YesNo OpenOnFriday { get; set; }
        public YesNo OpenOnSaturday { get; set; }
        public YesNo OpenOnSunday { get; set; }
        public YesNo OpenOnPublicHoliday { get; set; }


        public TimeSpan? MondayStart { get; set; }
        public TimeSpan? TuesdayStart { get; set; }
        public TimeSpan? WednesdayStart { get; set; }
        public TimeSpan? ThursdayStart { get; set; }
        public TimeSpan? FridayStart { get; set; }
        public TimeSpan? SaturdayStart { get; set; }
        public TimeSpan? SundayStart { get; set; }
        public TimeSpan? PublicHolidayStart { get; set; }


        public TimeSpan? MondayClose { get; set; }
        public TimeSpan? TuesdayClose { get; set; }
        public TimeSpan? WednesdayClose { get; set; }
        public TimeSpan? ThursdayClose { get; set; }
        public TimeSpan? FridayClose { get; set; }
        public TimeSpan? SaturdayClose { get; set; }
        public TimeSpan? SundayClose { get; set; }
        public TimeSpan? PublicHolidayClose { get; set; }

        public bool EditMode { get; set; }

        #endregion

        #region Model Options



        #endregion
    }
}