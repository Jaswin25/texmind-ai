package controllers

import (
	"context"
	"net/http"
	"time"

	"texmind-backend/db"
	"texmind-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func GetInventory(c *gin.Context) {
	if db.DB == nil || db.DB.Database == nil {
		c.JSON(http.StatusOK, gin.H{"data": []models.InventoryItem{}})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := db.DB.Collection("inventory").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var items []models.InventoryItem
	if err := cursor.All(ctx, &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": items})
}
