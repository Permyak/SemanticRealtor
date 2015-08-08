namespace SemanticNetworkKernel
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Дуга, соединяющая вершины в сем сети.
    /// </summary>
    public class Arc
    {
        /// <summary>
        /// Id Дуги.
        /// </summary>
        public int ArcId { get; set; }

        /// <summary>
        /// Текст дуги.
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// Gets or sets the from vertex id.
        /// </summary>
        public int? FromVertexId { get; set; }

        /// <summary>
        /// Начальная вершина дуги.
        /// </summary>
        public virtual Vertex FromVertex { get; set; }

        /// <summary>
        /// Gets or sets the to vertex id.
        /// </summary>
        public int? ToVertexId { get; set; }

        /// <summary>
        /// Конечная вершина дуги.
        /// </summary>
        public virtual Vertex ToVertex { get; set; }
        
        /// <summary>
        /// Gets or sets the semantic network id.
        /// </summary>
        public int SemanticNetworkId { get; set; }

        /// <summary>
        /// Gets or sets the semantic network.
        /// </summary>
        public virtual SemanticNetwork SemanticNetwork { get; set; }
    }
}