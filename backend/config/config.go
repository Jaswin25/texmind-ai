package config

import (
	"os"
)

type Config struct {
	MongoURI string
	DBName   string
	Port     string
}

func LoadConfig() Config {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "texmind"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	return Config{
		MongoURI: mongoURI,
		DBName:   dbName,
		Port:     port,
	}
}
