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

func GetNotifications(c *gin.Context) {
	if db.DB == nil || db.DB.Database == nil {
		c.JSON(http.StatusOK, gin.H{"data": []models.NotificationItem{}})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	role := c.Query("role")
	filter := bson.M{}
	if role != "" {
		filter["role"] = role
	}

	cursor, err := db.DB.Collection("notifications").Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var notifications []models.NotificationItem
	if err := cursor.All(ctx, &notifications); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": notifications})
}
