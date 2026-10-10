package main

import (
	"log"

	"texmind-backend/config"
	"texmind-backend/db"
	"texmind-backend/routes"
	"texmind-backend/seed"
)

func main() {
	log.Println("======================================================")
	log.Println(" Starting TexMind Go-Gin Backend Server...")
	log.Println("======================================================")

	cfg := config.LoadConfig()
	log.Printf("[Config] MongoDB URI: %s", cfg.MongoURI)
	log.Printf("[Config] Database Name: %s", cfg.DBName)
	log.Printf("[Config] Server Port: %s", cfg.Port)

	// Connect to MongoDB
	_, err := db.Connect(cfg)
	if err != nil {
		log.Printf("[Error] Could not initialize MongoDB: %v", err)
	}

	// Seed database with operational data
	seed.SeedDatabase()

	// Setup Router
	r := routes.SetupRouter()

	// Start HTTP Server
	log.Printf("[Server] Listening on http://localhost:%s/", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Server failed to run: %v", err)
	}
}
