namespace Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Arcs",
                c => new
                    {
                        ArcId = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        SemanticNetwork_SemanticNetworkId = c.Int(),
                        FromVertex_VertexId = c.Int(),
                        ToVertex_VertexId = c.Int(),
                    })
                .PrimaryKey(t => t.ArcId)
                .ForeignKey("dbo.SemanticNetworks", t => t.SemanticNetwork_SemanticNetworkId)
                .ForeignKey("dbo.Vertices", t => t.FromVertex_VertexId)
                .ForeignKey("dbo.Vertices", t => t.ToVertex_VertexId)
                .Index(t => t.SemanticNetwork_SemanticNetworkId)
                .Index(t => t.FromVertex_VertexId)
                .Index(t => t.ToVertex_VertexId);
            
            CreateTable(
                "dbo.Vertices",
                c => new
                    {
                        VertexId = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        IsSystem = c.Boolean(nullable: false),
                        SemanticNetwork_SemanticNetworkId = c.Int(),
                    })
                .PrimaryKey(t => t.VertexId)
                .ForeignKey("dbo.SemanticNetworks", t => t.SemanticNetwork_SemanticNetworkId)
                .Index(t => t.SemanticNetwork_SemanticNetworkId);
            
            CreateTable(
                "dbo.SemanticNetworks",
                c => new
                    {
                        SemanticNetworkId = c.Int(nullable: false, identity: true),
                    })
                .PrimaryKey(t => t.SemanticNetworkId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Arcs", "ToVertex_VertexId", "dbo.Vertices");
            DropForeignKey("dbo.Arcs", "FromVertex_VertexId", "dbo.Vertices");
            DropForeignKey("dbo.Vertices", "SemanticNetwork_SemanticNetworkId", "dbo.SemanticNetworks");
            DropForeignKey("dbo.Arcs", "SemanticNetwork_SemanticNetworkId", "dbo.SemanticNetworks");
            DropIndex("dbo.Vertices", new[] { "SemanticNetwork_SemanticNetworkId" });
            DropIndex("dbo.Arcs", new[] { "ToVertex_VertexId" });
            DropIndex("dbo.Arcs", new[] { "FromVertex_VertexId" });
            DropIndex("dbo.Arcs", new[] { "SemanticNetwork_SemanticNetworkId" });
            DropTable("dbo.SemanticNetworks");
            DropTable("dbo.Vertices");
            DropTable("dbo.Arcs");
        }
    }
}
