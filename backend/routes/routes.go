package routes

import (
	"time"

	"texmind-backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Configure CORS for Frontend integration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080", "http://localhost:3000", "http://localhost:5173", "*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "healthy",
			"service":   "TexMind Go-Gin Backend",
			"mongoURI":  "mongodb://localhost:27017/",
			"timestamp": time.Now(),
		})
	})

	// API Version 1 Group
	api := r.Group("/api/v1")
	{
		// Orders & Production
		api.GET("/orders", controllers.GetOrders)
		api.GET("/orders/:id", controllers.GetOrderByID)
		api.POST("/orders", controllers.CreateOrder)

		// Inventory
		api.GET("/inventory", controllers.GetInventory)

		// Buyers
		api.GET("/buyers", controllers.GetBuyers)
		api.GET("/buyers/:id", controllers.GetBuyerByID)

		// AI & Decision Support
		api.GET("/ai/insights", controllers.GetAIInsights)
		api.GET("/ai/health", controllers.GetFactoryHealth)

		// Notifications
		api.GET("/notifications", controllers.GetNotifications)
	}

	return r
}
