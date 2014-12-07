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

            var vertexA = new Vertex { Text = "a" };
            var vertexB = new Vertex { Text = "b" };
            var vertexC = new Vertex { Text = "c" };
            var vertexD = new Vertex { Text = "d" };
            var vertexE = new Vertex { Text = "e" };
            var vertexF = new Vertex { Text = "f" };

            list[0].Vertices = new Collection<Vertex> { vertexA, vertexB, vertexC, vertexD, vertexE, vertexF };

            list[0].Arcs = new Collection<Arc>();
            list[0].Arcs.Add(new Arc { Text = "edge#1", FromVertex = vertexA, ToVertex = vertexB });
            list[0].Arcs.Add(new Arc { Text = "edge#2", FromVertex = vertexA, ToVertex = vertexC });
            list[0].Arcs.Add(new Arc { Text = "edge#3", FromVertex = vertexA, ToVertex = vertexD });
            list[0].Arcs.Add(new Arc { Text = "edge#4", FromVertex = vertexA, ToVertex = vertexE });
            list[0].Arcs.Add(new Arc { Text = "edge#5", FromVertex = vertexA, ToVertex = vertexF });

            return list;
        }

        // GET api/<controller>
        public IEnumerable<SemanticNetwork> Get()
        {
            return getNewSemanticNetworks();
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
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