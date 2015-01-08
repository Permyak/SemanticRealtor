namespace Web.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using SemanticNetworkKernel;
    using Web.Models;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var context = new SemanticNetworkContext();

            List<SemanticNetwork> semNetworkList = (from data in context.SemanticNetworks select data).ToList();

            SelectList objmodeldata = new SelectList(semNetworkList, "SemanticNetworkId", "Name", 0);
            /*Assign value to model*/
            var objModel = new SemanticNetworkModel { SemanticNetworkListModel = objmodeldata };

            return View(objModel);
        }
    }
}
