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

func GetOrders(c *gin.Context) {
	if db.DB == nil || db.DB.Database == nil {
		c.JSON(http.StatusOK, gin.H{"data": []models.Order{}})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{}
	buyerID := c.Query("buyerId")
	if buyerID != "" {
		filter["buyerId"] = buyerID
	}
	status := c.Query("status")
	if status != "" {
		filter["status"] = status
	}
	stage := c.Query("stage")
	if stage != "" {
		filter["currentStage"] = stage
	}

	cursor, err := db.DB.Collection("orders").Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders, "count": len(orders)})
}

func GetOrderByID(c *gin.Context) {
	id := c.Param("id")
	if db.DB == nil || db.DB.Database == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var order models.Order
	err := db.DB.Collection("orders").FindOne(ctx, bson.M{"id": id}).Decode(&order)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found: " + id})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

func CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := db.DB.Collection("orders").InsertOne(ctx, order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "insertedId": res.InsertedID})
}
