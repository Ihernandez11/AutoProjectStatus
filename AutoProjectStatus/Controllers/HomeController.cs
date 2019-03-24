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


        public ActionResult Index(int? page)
        {


            //Remove any records from viewModel where client name is null
            List<ExecutiveStatus> allRecords = db.ExecutiveStatus.Where(x => x.CLIENT_NAME != "").ToList();

            //Create a list of lists that will store each client group
            List<List<ExecutiveStatus>> groupedClientStatusRecords = allRecords
                .GroupBy(c => c.CLIENT_NAME)
                .Select(grp => grp.ToList())
                .ToList();

            //declare pageSize and default number
            int pageSize = 6;

            //if page is null, make it 1
            int pageNumber = (page ?? 1);

            //create the model which is a list of Paged Executive Status Lists            
            List<IPagedList<ExecutiveStatus>> model = new List<IPagedList<ExecutiveStatus>>();

            //Add each pagedList to the model
            foreach (List<ExecutiveStatus> esList in groupedClientStatusRecords)
            {
                model.Add(esList.ToPagedList(pageNumber, pageSize));
            }

            

            return View(model);

        }

        public ActionResult PagedStatusList()
        {
            return PartialView();
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

        public JsonResult GetExecutiveStatus(int? id)
        {
            ExecutiveStatus model = db.ExecutiveStatus.Find(id);            
            return Json(model, JsonRequestBehavior.AllowGet);
        }


        

        
    }
}