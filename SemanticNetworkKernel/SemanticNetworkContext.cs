namespace SemanticNetworkKernel
{
    using System.Data.Entity;

    /// <summary>
    /// Вершина семантической сети.
    /// </summary>
    public class SemanticNetworkContext : DbContext
    {
        /// <summary>
        /// Дуги семантической сети.
        /// </summary>
        public DbSet<Arc> Arcs { get; set; }

        /// <summary>
        /// Вершины семантической сети.
        /// </summary>
        public DbSet<Vertex> Vertices { get; set; }

        /// <summary>
        /// Семантические сети.
        /// </summary>
        public DbSet<SemanticNetwork> SemanticNetworks { get; set; }
    }
}