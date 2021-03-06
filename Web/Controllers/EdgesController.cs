﻿namespace Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using SemanticNetworkKernel;

    public class EdgesController : ApiController
    {
        private SemanticNetworkContext _context = new SemanticNetworkContext();

        // GET api/<controller>
        public IEnumerable<ArcView>Get()
        {
            return _context.Arcs.Select(
                x => new ArcView
                {
                    SemanticNetworkId = x.SemanticNetworkId,
                    Text = x.Text,
                    ArcId = x.ArcId,
                    ToVertexId = x.ToVertexId,
                    FromVertexId = x.FromVertexId
                }).ToList();
        }

        // GET api/<controller>/5
        public ArcView Get(int id)
        {
            var arc = _context.Arcs.Find(id);
            if (arc == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return new ArcView(arc);
        }

        // POST api/<controller>
        public ArcView Post([FromBody]Arc arc)
        {
            var semNetwork = _context.SemanticNetworks.FirstOrDefault(x => x.SemanticNetworkId == arc.SemanticNetworkId);
            if (semNetwork == null)
            {
                throw new Exception("Семантическои сети с таким id не существует");
            }
            
            _context.Arcs.Add(arc);
            _context.SaveChanges();

            return new ArcView(arc);
        }

        // PUT api/<controller>/5
        public ArcView Put(int id, [FromBody]Arc newArc)
        {
            var arc = _context.Arcs.Find(id);
            if (arc == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            arc.Text = newArc.Text;
            arc.FromVertexId = newArc.FromVertexId;
            arc.ToVertexId = newArc.ToVertexId;

            _context.SaveChanges();
            return new ArcView(arc);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            var arc = _context.Arcs.Find(id);
            if (arc == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            _context.Arcs.Remove(arc);
            _context.SaveChanges();
        }
    }
}