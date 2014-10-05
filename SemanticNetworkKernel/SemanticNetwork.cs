namespace SemanticNetworkKernel
{
    using System.Collections.Generic;

    /// <summary>
    /// Класс семантической сети.
    /// </summary>
    public class SemanticNetwork
    {
        /// <summary>
        /// Semantic network id.
        /// </summary>
        public int SemanticNetworkId { get; set; }

        /// <summary>
        /// Вершины семантической сети.
        /// </summary>
        public virtual List<Vertex> Vertices { get; set; }

        /// <summary>
        /// Дуги семантической сети.
        /// </summary>
        public virtual List<Arc> Arcs { get; set; } 
    }
}
