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

func GetBuyers(c *gin.Context) {
	if db.DB == nil || db.DB.Database == nil {
		c.JSON(http.StatusOK, gin.H{"data": []models.Buyer{}})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := db.DB.Collection("buyers").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var buyers []models.Buyer
	if err := cursor.All(ctx, &buyers); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": buyers})
}

func GetBuyerByID(c *gin.Context) {
	id := c.Param("id")
	if db.DB == nil || db.DB.Database == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Buyer not found"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var buyer models.Buyer
	err := db.DB.Collection("buyers").FindOne(ctx, bson.M{"id": id}).Decode(&buyer)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Buyer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": buyer})
}
