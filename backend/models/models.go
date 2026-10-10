package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type StageRecord struct {
	Key       string `json:"key" bson:"key"`
	Label     string `json:"label" bson:"label"`
	State     string `json:"state" bson:"state"` // "completed" | "current" | "pending" | "delayed"
	Target    int    `json:"target" bson:"target"`
	Completed int    `json:"completed" bson:"completed"`
	Pending   int    `json:"pending" bson:"pending"`
	Rejected  int    `json:"rejected" bson:"rejected"`
	Progress  int    `json:"progress" bson:"progress"`
	Rate      int    `json:"rate" bson:"rate"`
	Manager   string `json:"manager" bson:"manager"`
	Expected  string `json:"expected" bson:"expected"`
}

type Order struct {
	ID           primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	OrderID      string             `json:"id" bson:"id"`
	BuyerID      string             `json:"buyerId" bson:"buyerId"`
	Buyer        string             `json:"buyer" bson:"buyer"`
	Product      string             `json:"product" bson:"product"`
	Category     string             `json:"category" bson:"category"`
	StyleNo      string             `json:"styleNo" bson:"styleNo"`
	PONo         string             `json:"poNo" bson:"poNo"`
	Quantity     int                `json:"quantity" bson:"quantity"`
	Fabric       string             `json:"fabric" bson:"fabric"`
	Color        string             `json:"color" bson:"color"`
	StartDate    string             `json:"startDate" bson:"startDate"`
	DeliveryDate string             `json:"deliveryDate" bson:"deliveryDate"`
	Priority     string             `json:"priority" bson:"priority"` // "High" | "Medium" | "Low"
	Status       string             `json:"status" bson:"status"`     // "On Track" | "Delayed" | "Completed" | "At Risk"
	CurrentStage string             `json:"currentStage" bson:"currentStage"`
	Progress     int                `json:"progress" bson:"progress"`
	Stages       []StageRecord      `json:"stages" bson:"stages"`
	CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt    time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type InventoryItem struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	ItemID      string             `json:"id" bson:"id"`
	Material    string             `json:"material" bson:"material"`
	Category    string             `json:"category" bson:"category"`
	Stock       int                `json:"stock" bson:"stock"`
	Unit        string             `json:"unit" bson:"unit"`
	MinRequired int                `json:"minRequired" bson:"minRequired"`
	Status      string             `json:"status" bson:"status"` // "In Stock" | "Low Stock" | "Critical"
	CoverDays   int                `json:"coverDays" bson:"coverDays"`
	Supplier    string             `json:"supplier" bson:"supplier"`
	LastUpdate  string             `json:"lastUpdate" bson:"lastUpdate"`
}

type Worker struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	WorkerID   string             `json:"id" bson:"id"`
	Name       string             `json:"name" bson:"name"`
	Role       string             `json:"role" bson:"role"`
	Stage      string             `json:"stage" bson:"stage"`
	Shift      string             `json:"shift" bson:"shift"`
	Efficiency int                `json:"efficiency" bson:"efficiency"`
	Status     string             `json:"status" bson:"status"` // "Present" | "Absent" | "On Leave"
}

type Buyer struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	BuyerID   string             `json:"id" bson:"id"`
	Name      string             `json:"name" bson:"name"`
	Company   string             `json:"company" bson:"company"`
	Country   string             `json:"country" bson:"country"`
	Contact   string             `json:"contact" bson:"contact"`
	Active    int                `json:"active" bson:"active"`
	Completed int                `json:"completed" bson:"completed"`
	Delayed   int                `json:"delayed" bson:"delayed"`
	Total     int                `json:"total" bson:"total"`
	LastOrder string             `json:"lastOrder" bson:"lastOrder"`
}

type NotificationItem struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	NotifID   string             `json:"id" bson:"id"`
	Title     string             `json:"title" bson:"title"`
	Message   string             `json:"message" bson:"message"`
	Type      string             `json:"type" bson:"type"` // "danger" | "warning" | "info" | "success"
	Time      string             `json:"time" bson:"time"`
	Read      bool               `json:"read" bson:"read"`
	Role      string             `json:"role" bson:"role"` // "admin" | "buyer" | "process"
	OrderID   string             `json:"orderId,omitempty" bson:"orderId,omitempty"`
}

type AIInsight struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	InsightID   string             `json:"id" bson:"id"`
	Severity    string             `json:"severity" bson:"severity"` // "high" | "medium" | "low"
	Stage       string             `json:"stage" bson:"stage"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	Action      string             `json:"action" bson:"action"`
	Impact      string             `json:"impact" bson:"impact"`
	OrderID     string             `json:"orderId,omitempty" bson:"orderId,omitempty"`
}

type RiskMetric struct {
	Label string `json:"label" bson:"label"`
	Score int    `json:"score" bson:"score"`
	Tone  string `json:"tone" bson:"tone"` // "danger" | "warning" | "success"
	Note  string `json:"note" bson:"note"`
}

type FactoryHealth struct {
	OverallHealth int          `json:"overallHealth" bson:"overallHealth"`
	Breakdown     []HealthItem `json:"breakdown" bson:"breakdown"`
	Risks         []RiskMetric `json:"risks" bson:"risks"`
}

type HealthItem struct {
	Label string `json:"label" bson:"label"`
	Value int    `json:"value" bson:"value"`
}
