using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AutoProjectStatus.DAL
{
    public static class DateHelper
    {

        public static DateTime ToShortDate(this DateTime? date)
        {
            if (date == null)
            {
                return Convert.ToDateTime(null);
            }
            return Convert.ToDateTime(date.Value.ToShortDateString());
        }

        

    }
}