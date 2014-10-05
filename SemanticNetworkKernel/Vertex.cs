namespace SemanticNetworkKernel
{
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
        /// Semantic network.
        /// </summary>
        public SemanticNetwork SemanticNetwork { get; set; }
    }
}