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

        /// <summary>
        /// The on model creating.
        /// </summary>
        /// <param name="modelBuilder">
        /// The model builder.
        /// </param>
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Arc>()
                        .HasOptional(m => m.ToVertex)
                        .WithMany(t => t.ToArcs)
                        .HasForeignKey(m => m.ToVertexId)
                        .WillCascadeOnDelete(false);

            modelBuilder.Entity<Arc>()
                        .HasOptional(m => m.FromVertex)
                        .WithMany(t => t.FromArcs)
                        .HasForeignKey(m => m.FromVertexId)
                        .WillCascadeOnDelete(false);
        }
    }
}