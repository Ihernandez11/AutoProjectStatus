using AutoProjectStatus.DAL;
using AutoProjectStatus.Models;
using Sap.Data.Hana;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using System.Data.Entity.Infrastructure;

namespace AutoProjectStatus.Controllers
{
    public class HomeController : Controller
    {

        //Create db Context
        private AutoProjectContext db = new AutoProjectContext();


        public ActionResult Index()
        {

            //Remove any records from viewModel where client name is null
            List<ExecutiveStatus> model = db.ExecutiveStatus.Where(x => x.CLIENT_NAME != "" && x.CLIENT_NAME != null)
                .ToList();
            
            return View(model);

        }

        [HttpPost]
        public ActionResult Insert(ExecutiveStatus model)
        {

            //create new seq_num
            model.SEQ_NUM = db.ExecutiveStatus.OrderByDescending(m => m.SEQ_NUM).FirstOrDefault().SEQ_NUM + 1;


            //Create Project Type from List
            if (model.ProjectTypeList != null)
            {
                model.PROJECT_TYPE = String.Join(",", model.ProjectTypeList);
            }


            ExecutiveStatus newStatus = new ExecutiveStatus()
            {
                SEQ_NUM = model.SEQ_NUM,
                CLIENT_NAME = model.CLIENT_NAME,
                PROJECT_PRIORITY = model.PROJECT_PRIORITY,
                OPEN_STATUS = model.OPEN_STATUS,
                RETAIL_AFTERSALES = model.RETAIL_AFTERSALES,
                PROJECT_NAME = model.PROJECT_NAME,
                PROJECT_COMMENTS = model.PROJECT_COMMENTS,
                PROJECT_TYPE = model.PROJECT_TYPE,
                START_DATE = model.START_DATE,
                PLANNED_END_DATE = model.PLANNED_END_DATE,
                ACTUAL_END_DATE = model.ACTUAL_END_DATE,
                PROJECT_DESCRIPTION = model.PROJECT_DESCRIPTION,
                PROJECT_STATUS = model.PROJECT_STATUS,
                PROJECT_CONSTRAINTS = model.PROJECT_CONSTRAINTS,
                SCHEDULE = model.SCHEDULE,
                BUDGET = model.BUDGET,
                CLIENT_SATISFACTION = model.CLIENT_SATISFACTION,
                SCOPE = model.SCOPE,
                RESOURCES = model.RESOURCES,
                OTHER_RISK = model.OTHER_RISK
            };


            db.ExecutiveStatus.Add(newStatus);
            db.SaveChanges();

            newStatus.CLIENT_NAME = newStatus.CLIENT_NAME.Replace(" ", "-");
            string newURL = "/Home/Index#" + newStatus.CLIENT_NAME;



            return Redirect(newURL);

        }

        [HttpPost]
        public JsonResult CloneInsert(ExecutiveStatus model)
        {
            
            //create new seq_num
            model.SEQ_NUM = db.ExecutiveStatus.OrderByDescending(m => m.SEQ_NUM).FirstOrDefault().SEQ_NUM + 1;
            
            

            //Create Project Type from List
            if(model.ProjectTypeList != null)
            {
                model.PROJECT_TYPE = String.Join(",", model.ProjectTypeList);
            }

            string validationErrors = string.Empty;


            //required fields validation
            if (model.PROJECT_NAME == null ||
                model.PROJECT_CONSTRAINTS == null ||
                model.SCHEDULE == null ||
                model.BUDGET == null ||
                model.CLIENT_SATISFACTION == null ||
                model.SCOPE == null ||
                model.RESOURCES == null ||
                model.OTHER_RISK == null
                ||
                model.PROJECT_NAME.Contains("?") ||
                model.PROJECT_CONSTRAINTS.Contains("?") ||
                model.SCHEDULE.Contains("?") ||
                model.BUDGET.Contains("?") ||
                model.CLIENT_SATISFACTION.Contains("?") ||
                model.SCOPE.Contains("?") ||
                model.RESOURCES.Contains("?") ||
                model.OTHER_RISK.Contains("?"))
            {
                validationErrors += "Please provide a value for all required fields";
                return Json(new { errorMessage = validationErrors, success = "false" }, JsonRequestBehavior.AllowGet);
            }

            ExecutiveStatus newStatus = new ExecutiveStatus()
            {
                SEQ_NUM = model.SEQ_NUM,
                CLIENT_NAME = model.CLIENT_NAME,
                PROJECT_PRIORITY = model.PROJECT_PRIORITY,
                OPEN_STATUS = model.OPEN_STATUS,
                RETAIL_AFTERSALES = model.RETAIL_AFTERSALES,
                PROJECT_NAME = model.PROJECT_NAME,
                PROJECT_COMMENTS = model.PROJECT_COMMENTS,
                PROJECT_TYPE = model.PROJECT_TYPE,
                START_DATE = model.START_DATE,
                PLANNED_END_DATE = model.PLANNED_END_DATE,
                ACTUAL_END_DATE = model.ACTUAL_END_DATE,
                PROJECT_DESCRIPTION = model.PROJECT_DESCRIPTION,
                PROJECT_STATUS = model.PROJECT_STATUS,
                PROJECT_CONSTRAINTS = model.PROJECT_CONSTRAINTS,
                SCHEDULE = model.SCHEDULE,
                BUDGET = model.BUDGET,
                CLIENT_SATISFACTION = model.CLIENT_SATISFACTION,
                SCOPE = model.SCOPE,
                RESOURCES = model.RESOURCES,
                OTHER_RISK = model.OTHER_RISK
            };



            
                db.ExecutiveStatus.Add(newStatus);
                db.SaveChanges();

            newStatus.CLIENT_NAME = newStatus.CLIENT_NAME.Replace(" ", "-");
            string newURL = "/Home/Index#" + newStatus.CLIENT_NAME;



            return Json(new { redirectURL = newURL, success = "true" }, JsonRequestBehavior.AllowGet);


        }

        [HttpPost]
        public JsonResult Edit(ExecutiveStatus model)
        {
            
            //!!!!before submitting the edit post, change the project type from an array back to a string

            ExecutiveStatus statusToUpdate = db.ExecutiveStatus.Where(s => s.SEQ_NUM == model.SEQ_NUM).FirstOrDefault();
            //Create Project Type from List
            if (model.ProjectTypeList != null)
            {
                statusToUpdate.PROJECT_TYPE = String.Join(",", model.ProjectTypeList);
            }

            string validationErrors = string.Empty;

            //required fields validation
            if (model.PROJECT_NAME == null  ||
                model.PROJECT_CONSTRAINTS == null ||
                model.SCHEDULE == null ||
                model.BUDGET == null ||
                model.CLIENT_SATISFACTION == null ||
                model.SCOPE == null ||
                model.RESOURCES == null ||
                model.OTHER_RISK == null
                ||
                model.PROJECT_NAME.Contains("?") ||
                model.PROJECT_CONSTRAINTS.Contains("?") ||
                model.SCHEDULE.Contains("?") ||
                model.BUDGET.Contains("?") ||
                model.CLIENT_SATISFACTION.Contains("?") ||
                model.SCOPE.Contains("?") ||
                model.RESOURCES.Contains("?") ||
                model.OTHER_RISK.Contains("?"))
            {
                validationErrors += "Please provide a value for all required fields";
                return Json(new { errorMessage = validationErrors, success = "false"}, JsonRequestBehavior.AllowGet);
            }


            //provide list of model attributes that should be updated
            if (TryUpdateModel(statusToUpdate,"", 
                new string[] {"CLIENT_NAME",
                                "PROJECT_PRIORITY",
                                "OPEN_STATUS",
                                "RETAIL_AFTERSALES",
                                "PROJECT_NAME",
                                "PROJECT_TYPE",
                                "START_DATE",
                                "PLANNED_END_DATE",
                                "ACTUAL_END_DATE",
                                "PROJECT_DESCRIPTION",
                                "PROJECT_STATUS",
                                "PROJECT_CONSTRAINTS",
                                "SCHEDULE",
                                "BUDGET",
                                "CLIENT_SATISFACTION",
                                "SCOPE",
                                "RESOURCES",
                                "OTHER_RISK"}))
            {
                
                    db.SaveChanges();
                statusToUpdate.CLIENT_NAME = statusToUpdate.CLIENT_NAME.Replace(" ", "-");
                
                string newURL = "/Home/Index#" + statusToUpdate.CLIENT_NAME;
                return Json(new { redirectURL = newURL, success = "true" }, JsonRequestBehavior.AllowGet);

            }

            return Json(new { success = "false" }, JsonRequestBehavior.AllowGet);

        }

        
        

        [HttpPost]
        public JsonResult Delete(ExecutiveStatus model)
        {

            ExecutiveStatus statusToDelete = db.ExecutiveStatus.Where(s => s.SEQ_NUM == model.SEQ_NUM).FirstOrDefault();

            if (statusToDelete == null)
            {
                return Json(new { success = "false" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                db.ExecutiveStatus.Remove(statusToDelete);

                db.SaveChanges();

                statusToDelete.CLIENT_NAME = statusToDelete.CLIENT_NAME.Replace(" ", "-");

                string newURL = "/Home/Index#" + statusToDelete.CLIENT_NAME;

                return Json(new { redirectURL = newURL, success = "true" }, JsonRequestBehavior.AllowGet);
                
            }


        }

        
        public JsonResult GetExecutiveStatus(string clientName)
        {
            //Default Autonation as client Name if null
            clientName = clientName ?? "Autonation";
            
            //string manipulation for ampersand
            clientName = clientName.Replace("and", "&");

            //Get model
            List<ExecutiveStatus> model = db.ExecutiveStatus.Where(x => x.CLIENT_NAME == clientName).ToList();

            //SetNoStore on the cache values so the records are reset on every db visit
            Response.Cache.SetNoStore();

            return Json(model, JsonRequestBehavior.AllowGet);
        }


    }
}