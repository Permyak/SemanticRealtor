namespace SemanticNetworkKernel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Arcs",
                c => new
                    {
                        ArcId = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        FromVertexId = c.Int(),
                        ToVertexId = c.Int(),
                        SemanticNetworkId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ArcId)
                .ForeignKey("dbo.SemanticNetworks", t => t.SemanticNetworkId, cascadeDelete: true)
                .ForeignKey("dbo.Vertices", t => t.FromVertexId)
                .ForeignKey("dbo.Vertices", t => t.ToVertexId)
                .Index(t => t.FromVertexId)
                .Index(t => t.ToVertexId)
                .Index(t => t.SemanticNetworkId);
            
            CreateTable(
                "dbo.Vertices",
                c => new
                    {
                        VertexId = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        IsSystem = c.Boolean(nullable: false),
                        SemanticNetworkId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.VertexId)
                .ForeignKey("dbo.SemanticNetworks", t => t.SemanticNetworkId, cascadeDelete: true)
                .Index(t => t.SemanticNetworkId);
            
            CreateTable(
                "dbo.SemanticNetworks",
                c => new
                    {
                        SemanticNetworkId = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.SemanticNetworkId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Arcs", "ToVertexId", "dbo.Vertices");
            DropForeignKey("dbo.Arcs", "FromVertexId", "dbo.Vertices");
            DropForeignKey("dbo.Vertices", "SemanticNetworkId", "dbo.SemanticNetworks");
            DropForeignKey("dbo.Arcs", "SemanticNetworkId", "dbo.SemanticNetworks");
            DropIndex("dbo.Vertices", new[] { "SemanticNetworkId" });
            DropIndex("dbo.Arcs", new[] { "SemanticNetworkId" });
            DropIndex("dbo.Arcs", new[] { "ToVertexId" });
            DropIndex("dbo.Arcs", new[] { "FromVertexId" });
            DropTable("dbo.SemanticNetworks");
            DropTable("dbo.Vertices");
            DropTable("dbo.Arcs");
        }
    }
}
