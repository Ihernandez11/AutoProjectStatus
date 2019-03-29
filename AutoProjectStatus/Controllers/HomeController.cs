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

        public ActionResult PagedStatusList(string clientName, int? page)
        {
            //Default Autonation as client Name
            clientName = clientName ?? "Autonation";
            //declare pageSize and default number
            int pageSize = 6;

            //if page is null, make it 1
            int pageNumber = page ?? 1;

            //Create list of records for requested clientName
            List<ExecutiveStatus> allRecords = db.ExecutiveStatus.Where(c => c.CLIENT_NAME == clientName).ToList();

            //create the model which is a list of Paged Executive Status Lists            
            PagedList<ExecutiveStatus> model = new PagedList<ExecutiveStatus>(allRecords, pageNumber, pageSize);

            return PartialView(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Insert(ExecutiveStatus model)
        {
            //create new seq_num
            model.SEQ_NUM = db.ExecutiveStatus.OrderByDescending(m => m.SEQ_NUM).FirstOrDefault().SEQ_NUM + 1;

            //Create Project Type from List
            model.PROJECT_TYPE = String.Join(",", model.ProjectTypeList);

            db.ExecutiveStatus.Add(model);
            db.SaveChanges();

            return RedirectToAction("Index");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(ExecutiveStatus model)
        {
            //create new seq_num
            model.SEQ_NUM = db.ExecutiveStatus.OrderByDescending(m => m.SEQ_NUM).FirstOrDefault().SEQ_NUM + 1;

            //Create Project Type from List
            model.PROJECT_TYPE = String.Join(",", model.ProjectTypeList);


            db.ExecutiveStatus.Add(model);

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