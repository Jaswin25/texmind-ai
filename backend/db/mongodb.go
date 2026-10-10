package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"texmind-backend/config"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDB struct {
	Client   *mongo.Client
	Database *mongo.Database
}

var DB *MongoDB

func Connect(cfg config.Config) (*MongoDB, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Printf("[MongoDB] Connecting to %s (DB: %s)...", cfg.MongoURI, cfg.DBName)

	clientOpts := options.Client().ApplyURI(cfg.MongoURI)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	// Ping database
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Printf("[MongoDB Warning] Could not ping MongoDB at %s: %v. Running in disconnected/memory mode if offline.", cfg.MongoURI, err)
	} else {
		log.Println("[MongoDB] Connected successfully to MongoDB!")
	}

	database := client.Database(cfg.DBName)

	instance := &MongoDB{
		Client:   client,
		Database: database,
	}

	DB = instance
	return instance, nil
}

func (m *MongoDB) Collection(name string) *mongo.Collection {
	return m.Database.Collection(name)
}
