namespace SemanticNetworkKernel
{
    using System.Collections.Generic;

    /// <summary>
    /// Вершина семантической сети.
    /// </summary>
    public class Vertex
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
        /// Gets or sets the semantic network.
        /// </summary>
        public virtual SemanticNetwork SemanticNetwork { get; set; }

        /// <summary>
        /// Gets or sets the to arcs.
        /// </summary>
        public virtual ICollection<Arc> ToArcs { get; set; }

        /// <summary>
        /// Gets or sets the from arcs.
        /// </summary>
        public virtual ICollection<Arc> FromArcs { get; set; }
    }
}