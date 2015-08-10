namespace SemanticNetworkKernel
{
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Представление дуги.
    /// </summary>
    public class VertexView
    {
        /// <summary>
        /// Vertex id.
        /// </summary>
        public int VertexId { get; set; }

        /// <summary>
        /// Текст, отображаемый на вершине.
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// Является ли вершина системной.
        /// </summary>
        public bool IsSystem { get; set; }

        /// <summary>
        /// Gets or sets the semantic network id.
        /// </summary>
        public int SemanticNetworkId { get; set; }
        
        /// <summary>
        /// Gets or sets the to arcs.
        /// </summary>
        public IEnumerable<int> ToArcs { get; set; }

        /// <summary>
        /// Gets or sets the from arcs.
        /// </summary>
        public IEnumerable<int> FromArcs { get; set; }

        public VertexView()
        {
            
        }
        
        public VertexView(Vertex vertex)
        {
            this.SemanticNetworkId = vertex.SemanticNetworkId;
            this.IsSystem = vertex.IsSystem;
            this.Text = vertex.Text;
            this.VertexId = vertex.VertexId;
            if (vertex.FromArcs != null)
            {
                this.FromArcs = vertex.FromArcs.Select(t => t.ArcId);
            }

            if (vertex.ToArcs != null)
            {
                this.ToArcs = vertex.ToArcs.Select(t => t.ArcId);
            }
        }
    }
}