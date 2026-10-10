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

func GetAIInsights(c *gin.Context) {
	if db.DB == nil || db.DB.Database == nil {
		c.JSON(http.StatusOK, gin.H{"data": []models.AIInsight{}})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := db.DB.Collection("ai_insights").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var insights []models.AIInsight
	if err := cursor.All(ctx, &insights); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": insights})
}

func GetFactoryHealth(c *gin.Context) {
	health := models.FactoryHealth{
		OverallHealth: 94,
		Breakdown: []models.HealthItem{
			{Label: "Delivery Reliability", Value: 96},
			{Label: "Quality Index", Value: 98},
			{Label: "Machine Uptime", Value: 92},
			{Label: "Capacity Utilization", Value: 89},
		},
		Risks: []models.RiskMetric{
			{Label: "Production Risk", Score: 34, Tone: "warning", Note: "Sewing capacity gap of 800 pcs/day"},
			{Label: "Delivery Risk", Score: 41, Tone: "warning", Note: "2 orders trending past committed dates"},
			{Label: "Inventory Risk", Score: 52, Tone: "danger", Note: "Cotton yarn cover under 7 days"},
			{Label: "Quality Risk", Score: 22, Tone: "success", Note: "Rejection stable at 1.6% factory-wide"},
			{Label: "Bottleneck Risk", Score: 68, Tone: "danger", Note: "Sewing holds 18,450 pcs pending"},
		},
	}
	c.JSON(http.StatusOK, gin.H{"data": health})
}
