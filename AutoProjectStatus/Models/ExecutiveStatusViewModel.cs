using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AutoProjectStatus.Models
{
    public class ExecutiveStatusViewModel
    {

        public ExecutiveStatusViewModel()
        {
            ClientNames = ConvertToSelectListItem(GetAllClientNames());
            OpenStatusValues = ConvertToSelectListItem(GetAllOpenStatusValues());
            RetailAfterSalesValues = ConvertToSelectListItem(GetAllRetailAfterSalesValues());
            ProjectTypes = ConvertToSelectListItem(GetAllProjectTypes());
            ProjectContstraints = ConvertToSelectListItem(GetAllProjectConstraints());
            Schedules = ConvertToSelectListItem(GetAllHealthValues());
            Budgets = ConvertToSelectListItem(GetAllHealthValues());
            Scopes = ConvertToSelectListItem(GetAllHealthValues());
            ResourceValues = ConvertToSelectListItem(GetAllHealthValues());
            OtherRisks = ConvertToSelectListItem(GetAllHealthValues());
            
                

        }

        public int SEQ_NUM { get; set; }
        public string CLIENT_NAME { get; set; }
        public int PROJECT_PRIORITY { get; set; }
        public string OPEN_STATUS { get; set; }
        public string RETAIL_AFTERSALES { get; set; }
        public string PROJECT_NAME { get; set; }
        public string PROJECT_COMMENTS { get; set; }
        public string PROJECT_TYPE { get; set; }
        public DateTime START_DATE { get; set; }
        public DateTime PLANNED_END_DATE { get; set; }
        public DateTime ACTUAL_END_DATE { get; set; }
        public string PROJECT_DESCRIPTION { get; set; }
        public string PROJECT_STATUS { get; set; }
        public string PROJECT_CONSTRAINTS { get; set; }
        public string SCHEDULE { get; set; }
        public string BUDGET { get; set; }
        public string CLIENT_SATISFACTION { get; set; }
        public string SCOPE { get; set; }
        public string RESOURCES { get; set; }
        public string OTHER_RISK { get; set; }

        public IEnumerable<SelectListItem> ClientNames { get; set; }
        public IEnumerable<SelectListItem> OpenStatusValues { get; set; }
        public IEnumerable<SelectListItem> RetailAfterSalesValues { get; set; }
        public IEnumerable<SelectListItem> ProjectTypes { get; set; }
        public IEnumerable<SelectListItem> ProjectContstraints { get; set; }
        public IEnumerable<SelectListItem> Schedules { get; set; }
        public IEnumerable<SelectListItem> Budgets { get; set; }
        public IEnumerable<SelectListItem> Scopes { get; set; }
        public IEnumerable<SelectListItem> ResourceValues { get; set; }
        public IEnumerable<SelectListItem> OtherRisks { get; set; }


        public IEnumerable<SelectListItem> ConvertToSelectListItem(IEnumerable<string> stringList)
        {
            return stringList.Select(i => new SelectListItem()
            {
                Text = i.ToString(),
                Value = i
            });
        }

        public IEnumerable<string> GetAllClientNames()
        {
            return new List<string>
            {
                "Autonation",
                "AT&T",
                "BMWFS",
                "BMWNA",
                "Business Intelligence",
                "Ford",
                "GM",
                "GM Financial",
                "NCI",
                "Nissan"
            };
        }

        public IEnumerable<string> GetAllOpenStatusValues()
        {
            return new List<string>
            {
                "Project Completed",
                "Project Delivered",
                "Project Deployed",
                "Project In-Progress",
                "Project Late",
                "Project Not Started",
                "Project On-Hold",
            };
        }

        public IEnumerable<string> GetAllRetailAfterSalesValues()
        {
            return new List<string>
            {
                "Both",
                "Retail",
                "AfterSales"  
            };
        }


        public IEnumerable<string> GetAllProjectTypes()
        {
            return new List<string>
            {
                "Analytics (HANA)",
                "BI (Reporting/Dashboard)",
                "Campaign",
                "Continuous Improvement",
                "Database",
                "Harmony",
                "Interactive",
                "Pre-Sales",
                "Microsites",
            };
        }


        public IEnumerable<string> GetAllProjectConstraints()
        {
            return new List<string>
            {
                "Budget",
                "Client Commitment",
                "Management Commitment",
                "None",
                "Resources Needed",
                "Scope Creep",
                "STS Delays (Hardware/Software)"
            };
        }


        public IEnumerable<string> GetAllHealthValues()
        {
            return new List<string>
            {
                "1-Concerns Realize",
                "2-Major Concerns",
                "3-Warning",
                "4-Early Warning",
                "5-Healthy"
            };
        }


    }



}