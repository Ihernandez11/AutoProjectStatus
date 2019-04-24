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
            List<ExecutiveStatus> model = db.ExecutiveStatus.Where(x => x.CLIENT_NAME != "").ToList();
            

            return View(model);

        }

      

        [HttpPost]
        public ActionResult Insert(ExecutiveStatus model)
        {
            
            //create new seq_num
            model.SEQ_NUM = db.ExecutiveStatus.OrderByDescending(m => m.SEQ_NUM).FirstOrDefault().SEQ_NUM + 1;
            
            

            //Create Project Type from List
            if(model.ProjectTypeList != null)
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

            string newURL = "/Home/Index#" + newStatus.CLIENT_NAME;
                
                //return RedirectToAction("Index");
                return Redirect(newURL);
            

        }

        [HttpPost]
        public ActionResult Edit(ExecutiveStatus model)
        {
            
            ExecutiveStatus statusToUpdate = db.ExecutiveStatus.Where(s => s.SEQ_NUM == model.SEQ_NUM).FirstOrDefault();
            //Create Project Type from List
            if (model.ProjectTypeList != null)
            {
                statusToUpdate.PROJECT_TYPE = String.Join(",", model.ProjectTypeList);
            }
            

            //provide list of model attributes that should be updated
            if (TryUpdateModel(statusToUpdate,"", 
                new string[] {"PROJECT_PRIORITY",
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
                    return RedirectToAction("Index");
                
            }

            return RedirectToAction("Index");

        }

        public JsonResult GetExecutiveStatus(string clientName)
        {
            //Default Autonation as client Name if null
            clientName = clientName ?? "Autonation";
            
            //string manipulation for ampersand
            clientName = clientName.Replace("and", "&");

            //Get model
            List<ExecutiveStatus> model = db.ExecutiveStatus.Where(x => x.CLIENT_NAME == clientName).ToList();
            
            return Json(model, JsonRequestBehavior.AllowGet);
        }


    }
}