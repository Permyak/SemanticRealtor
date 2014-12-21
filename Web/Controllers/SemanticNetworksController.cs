namespace Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using SemanticNetworkKernel;

    public class SemanticNetworksController : ApiController
    {
        private SemanticNetworkContext _context = new SemanticNetworkContext();
        
        // GET api/<controller>
        public IEnumerable<SemanticNetwork> Get()
        {
            return _context.SemanticNetworks;
        }

        // GET api/<controller>/5
        public SemanticNetwork Get(int id)
        {
            var semNetwork = _context.SemanticNetworks.Find(id);
            if (semNetwork == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return semNetwork;
        }

        // POST api/<controller>
        public void Post([FromBody]SemanticNetwork semNetwork)
        {
            if (semNetwork != null)
            {
                _context.SemanticNetworks.Add(semNetwork);
                _context.SaveChanges();
            }
            else
            {
                throw new Exception("Пустое имя сем. сети.");
            }
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]SemanticNetwork newSemNetwork)
        {
            var semNetwork = _context.SemanticNetworks.Find(id);
            if (semNetwork == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            semNetwork.Name = newSemNetwork.Name;
            semNetwork.Vertices = newSemNetwork.Vertices;
            semNetwork.Arcs = newSemNetwork.Arcs;

            _context.SaveChanges();
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            var semNetwork = _context.SemanticNetworks.Find(id);
            if (semNetwork == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            _context.SemanticNetworks.Remove(semNetwork);
            _context.SaveChanges();
        }
    }
}