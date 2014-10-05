namespace SemanticNetworkKernel
{
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
        /// Начальная вершина дуги.
        /// </summary>
        public Vertex FromVertex { get; set; }

        /// <summary>
        /// Конечная вершина дуги.
        /// </summary>
        public Vertex ToVertex { get; set; }

        /// <summary>
        /// Semantic network.
        /// </summary>
        public SemanticNetwork SemanticNetwork { get; set; }
    }
}