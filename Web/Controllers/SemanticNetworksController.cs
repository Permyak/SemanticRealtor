namespace Web.Controllers
{
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Web.Http;
    using SemanticNetworkKernel;

    public class SemanticNetworksController : ApiController
    {
        private IEnumerable<SemanticNetwork> getNewSemanticNetworks()
        {
            var list = new List<SemanticNetwork>
            {
                new SemanticNetwork { Name = "network1" },
                new SemanticNetwork { Name = "network2" }
            };

            return list;
        }

        private SemanticNetwork getNewSemanticNetwork()
        {
            var semNet = new SemanticNetwork();

            var vertexA = new Vertex { Text = "a", SemanticNetwork = semNet};
            var vertexB = new Vertex { Text = "b" };
            var vertexC = new Vertex { Text = "c" };
            var vertexD = new Vertex { Text = "d" };
            var vertexE = new Vertex { Text = "e" };
            var vertexF = new Vertex { Text = "f" };

            semNet.Vertices = new Collection<Vertex> { vertexA, vertexB, vertexC, vertexD, vertexE, vertexF };

            semNet.Arcs = new Collection<Arc>();
            semNet.Arcs.Add(new Arc { Text = "edge#1", FromVertex = vertexA, ToVertex = vertexB });
            semNet.Arcs.Add(new Arc { Text = "edge#2", FromVertex = vertexA, ToVertex = vertexC });
            semNet.Arcs.Add(new Arc { Text = "edge#3", FromVertex = vertexA, ToVertex = vertexD });
            semNet.Arcs.Add(new Arc { Text = "edge#4", FromVertex = vertexA, ToVertex = vertexE });
            semNet.Arcs.Add(new Arc { Text = "edge#5", FromVertex = vertexA, ToVertex = vertexF });

            return semNet;
        }

        // GET api/<controller>
        public IEnumerable<SemanticNetwork> Get()
        {
            return getNewSemanticNetworks();
        }

        // GET api/<controller>/5
        public SemanticNetwork Get(int id)
        {
            return this.getNewSemanticNetwork();
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}