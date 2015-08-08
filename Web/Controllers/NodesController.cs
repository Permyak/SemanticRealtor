namespace Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using SemanticNetworkKernel;

    public class NodesController : ApiController
    {
        private SemanticNetworkContext _context = new SemanticNetworkContext();

        // GET api/nodes
        public IEnumerable<VertexView> Get()
        {
            return _context.Vertices.Select(
                x => new VertexView
                         {
                             IsSystem = x.IsSystem,
                             SemanticNetworkId = x.SemanticNetworkId,
                             Text = x.Text,
                             VertexId = x.VertexId,
                             FromArcs = x.FromArcs.Select(t => t.ArcId),
                             ToArcs = x.ToArcs.Select(t => t.ArcId)
                         }).ToList();
        }
        
        // GET api/<controller>/5
        public VertexView Get(int id)
        {
            var vertex = _context.Vertices.Find(id);
            if (vertex == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return new VertexView(vertex);
        }

        // POST api/<controller>
        public void Post([FromBody]Vertex vertex)
        {
            var semNetwork = _context.SemanticNetworks.FirstOrDefault(x => x.SemanticNetworkId == vertex.SemanticNetworkId);
            if (semNetwork == null)
            {
                throw new Exception("Семантическои сети с таким id не существует");
            }

            _context.Vertices.Add(vertex);
            _context.SaveChanges();
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]Vertex newVertex)
        {
            var vertex = _context.Vertices.Find(id);
            if (vertex == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            vertex.Text = newVertex.Text;
            vertex.IsSystem = newVertex.IsSystem;
            vertex.ToArcs = newVertex.ToArcs;
            vertex.FromArcs = newVertex.FromArcs;

            _context.SaveChanges();
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            var vertex = _context.Vertices.Find(id);
            if (vertex == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            _context.Vertices.Remove(vertex);
            _context.SaveChanges();
        }
    }
}