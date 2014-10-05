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
        /// Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Вершины семантической сети.
        /// </summary>
        public virtual ICollection<Vertex> Vertices { get; set; }

        /// <summary>
        /// Дуги семантической сети.
        /// </summary>
        public virtual ICollection<Arc> Arcs { get; set; } 
    }
}
