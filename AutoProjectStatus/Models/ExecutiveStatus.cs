using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Web.Mvc;

namespace AutoProjectStatus.Models
{
    [Table("T_EXECUTIVE_STATUS", Schema = "FORECAST")]
    public class ExecutiveStatus
    {
        public ExecutiveStatus()
        {
            ClientNameValues = ConvertToSelectListItem(GetAllClientNames());
            OpenStatusValues = ConvertToSelectListItem(GetAllOpenStatusValues());
            RetailAfterSalesValues = ConvertToSelectListItem(GetAllRetailAfterSalesValues());
            ProjectTypeValues = ConvertToSelectListItem(GetAllProjectTypes());
            ProjectContstraintValues = ConvertToSelectListItem(GetAllProjectConstraints());
            ScheduleValues = ConvertToSelectListItem(GetAllHealthValues());
            BudgetValues = ConvertToSelectListItem(GetAllHealthValues());
            ClientSatisfactionValues = ConvertToSelectListItem(GetAllHealthValues());
            ScopeValues = ConvertToSelectListItem(GetAllHealthValues());
            ResourceValues = ConvertToSelectListItem(GetAllHealthValues());
            OtherRiskValues = ConvertToSelectListItem(GetAllHealthValues());
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int SEQ_NUM { get; set; }
        public string CLIENT_NAME { get; set; }
        public int PROJECT_PRIORITY { get; set; }
        public string OPEN_STATUS { get; set; }
        public string RETAIL_AFTERSALES { get; set; }
        public string PROJECT_NAME { get; set; }
        public string PROJECT_COMMENTS { get; set; }
        public string PROJECT_TYPE { get; set; }
        public DateTime? START_DATE { get; set; }
        public DateTime? PLANNED_END_DATE { get; set; }
        public DateTime? ACTUAL_END_DATE { get; set; }
        public string PROJECT_DESCRIPTION { get; set; }
        public string PROJECT_STATUS { get; set; }
        public string PROJECT_CONSTRAINTS { get; set; }
        public string SCHEDULE { get; set; }
        public string BUDGET { get; set; }
        public string CLIENT_SATISFACTION { get; set; }
        public string SCOPE { get; set; }
        public string RESOURCES { get; set; }
        public string OTHER_RISK { get; set; }
        
        public IEnumerable<SelectListItem> ClientNameValues { get; set; }
        public IEnumerable<SelectListItem> OpenStatusValues { get; set; }
        public IEnumerable<SelectListItem> RetailAfterSalesValues { get; set; }
        public IEnumerable<SelectListItem> ProjectTypeValues { get; set; }
        public IEnumerable<SelectListItem> ProjectContstraintValues { get; set; }
        public IEnumerable<SelectListItem> ScheduleValues { get; set; }
        public IEnumerable<SelectListItem> BudgetValues { get; set; }
        public IEnumerable<SelectListItem> ClientSatisfactionValues { get; set; }
        public IEnumerable<SelectListItem> ScopeValues { get; set; }
        public IEnumerable<SelectListItem> ResourceValues { get; set; }
        public IEnumerable<SelectListItem> OtherRiskValues { get; set; }


        //Next Step: Add ProjectTypeList to Index page to capture multiple values
        public List<string> ProjectTypeList { get; set; }



        public IEnumerable<SelectListItem> ConvertToSelectListItem(IEnumerable<string> stringList)
        {
            return stringList.Select(i => new SelectListItem()
            {
                Text = i.ToString(),
                Value = i.ToString()
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
                "None",
                "Budget",
                "Client Commitment",
                "Management Commitment",
                "Resources Needed",
                "Scope Creep",
                "STS Delays (Hardware/Software)"
            };
        }


        public IEnumerable<string> GetAllHealthValues()
        {
            return new List<string>
            {
                "5-Healthy",
                "1-Concerns Realize",
                "2-Major Concerns",
                "3-Warning",
                "4-Early Warning"
                
            };
        }


        

    }




}