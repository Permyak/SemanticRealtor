namespace SemanticNetworkKernel
{
    /// <summary>
    /// Представление дуги.
    /// </summary>
    public class ArcView
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
        /// Gets or sets the to vertex id.
        /// </summary>
        public int? ToVertexId { get; set; }

        /// <summary>
        /// Gets or sets the semantic network id.
        /// </summary>
        public int SemanticNetworkId { get; set; }

        public ArcView()
        {
            
        }
        
        public ArcView(Arc arc)
        {
            this.SemanticNetworkId = arc.SemanticNetworkId;
            this.Text = arc.Text;
            this.ArcId = arc.ArcId;
            this.FromVertexId = arc.FromVertexId;
            this.ToVertexId = arc.ToVertexId;
        }
    }
}