using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UserManager.Models;
//using AttributeRouting;

namespace UserManager.Controllers
{
    public class UserController : Controller
    {
        List<User> users = new List<User>();

        [HttpGet]
        [ActionName("UserManager")]
        public JsonResult Get()
        {
            users = HelperFunctions.HelperClass.GetUserList();
            return Json(users, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ActionName("UserManager")]
        public bool Post(string firstName, string lastName, string email,long? phone)
        {
            int response = HelperFunctions.HelperClass.PushData(firstName, lastName, email, phone);
            return (response == 1) ? true : false;
        }

        [HttpPut]
        [ActionName("UserManager")]
        public bool Put(int UserId, string firstName, string lastName, string email, long? phone, string status)
        {
            int response = HelperFunctions.HelperClass.UpdateData(UserId, firstName, lastName, email, phone, status);
            return (response == 1) ? true : false;
        }

        [HttpDelete]
        [ActionName("UserManager")]
        public bool Delete(int UserId)
        {
            int response = HelperFunctions.HelperClass.DeleteRow(UserId);
            return (response == 1) ? true : false;
        }

    }
}
