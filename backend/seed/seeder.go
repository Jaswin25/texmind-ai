package seed

import (
	"context"
	"log"
	"time"

	"texmind-backend/db"
	"texmind-backend/models"

	"go.mongodb.org/mongo-driver/bson"
)

func SeedDatabase() {
	if db.DB == nil || db.DB.Database == nil {
		log.Println("[Seeder] DB not initialized, skipping seed.")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Seed Orders
	orderCol := db.DB.Collection("orders")
	count, _ := orderCol.CountDocuments(ctx, bson.M{})
	if count == 0 {
		log.Println("[Seeder] Seeding MongoDB 'orders' collection...")
		orders := getInitialOrders()
		var docs []interface{}
		for _, o := range orders {
			docs = append(docs, o)
		}
		_, err := orderCol.InsertMany(ctx, docs)
		if err != nil {
			log.Printf("[Seeder Error] Failed to seed orders: %v", err)
		} else {
			log.Printf("[Seeder] Inserted %d orders.", len(orders))
		}
	}

	// Seed Buyers
	buyerCol := db.DB.Collection("buyers")
	bCount, _ := buyerCol.CountDocuments(ctx, bson.M{})
	if bCount == 0 {
		log.Println("[Seeder] Seeding MongoDB 'buyers' collection...")
		buyers := getInitialBuyers()
		var docs []interface{}
		for _, b := range buyers {
			docs = append(docs, b)
		}
		_, err := buyerCol.InsertMany(ctx, docs)
		if err != nil {
			log.Printf("[Seeder Error] Failed to seed buyers: %v", err)
		} else {
			log.Printf("[Seeder] Inserted %d buyers.", len(buyers))
		}
	}

	// Seed Inventory
	invCol := db.DB.Collection("inventory")
	iCount, _ := invCol.CountDocuments(ctx, bson.M{})
	if iCount == 0 {
		log.Println("[Seeder] Seeding MongoDB 'inventory' collection...")
		inv := getInitialInventory()
		var docs []interface{}
		for _, item := range inv {
			docs = append(docs, item)
		}
		_, err := invCol.InsertMany(ctx, docs)
		if err != nil {
			log.Printf("[Seeder Error] Failed to seed inventory: %v", err)
		} else {
			log.Printf("[Seeder] Inserted %d inventory items.", len(inv))
		}
	}

	// Seed Notifications
	notifCol := db.DB.Collection("notifications")
	nCount, _ := notifCol.CountDocuments(ctx, bson.M{})
	if nCount == 0 {
		log.Println("[Seeder] Seeding MongoDB 'notifications' collection...")
		notifs := getInitialNotifications()
		var docs []interface{}
		for _, n := range notifs {
			docs = append(docs, n)
		}
		_, err := notifCol.InsertMany(ctx, docs)
		if err != nil {
			log.Printf("[Seeder Error] Failed to seed notifications: %v", err)
		} else {
			log.Printf("[Seeder] Inserted %d notifications.", len(notifs))
		}
	}

	// Seed AI Insights
	aiCol := db.DB.Collection("ai_insights")
	aCount, _ := aiCol.CountDocuments(ctx, bson.M{})
	if aCount == 0 {
		log.Println("[Seeder] Seeding MongoDB 'ai_insights' collection...")
		insights := getInitialAIInsights()
		var docs []interface{}
		for _, ai := range insights {
			docs = append(docs, ai)
		}
		_, err := aiCol.InsertMany(ctx, docs)
		if err != nil {
			log.Printf("[Seeder Error] Failed to seed AI insights: %v", err)
		} else {
			log.Printf("[Seeder] Inserted %d AI insights.", len(insights))
		}
	}
}

func getInitialBuyers() []models.Buyer {
	return []models.Buyer{
		{BuyerID: "BUY-01", Name: "Anita Sharma", Company: "ABC Fashion", Country: "United Kingdom", Contact: "anita@abcfashion.co.uk", Active: 3, Completed: 8, Delayed: 1, Total: 12, LastOrder: "02 Sep 2026"},
		{BuyerID: "BUY-02", Name: "Michael Reed", Company: "Northline Apparel", Country: "United States", Contact: "m.reed@northline.com", Active: 3, Completed: 5, Delayed: 0, Total: 8, LastOrder: "28 Aug 2026"},
		{BuyerID: "BUY-03", Name: "Sofia Almeida", Company: "Lisboa Knitwear", Country: "Portugal", Contact: "sofia@lisboaknit.pt", Active: 3, Completed: 4, Delayed: 1, Total: 8, LastOrder: "30 Aug 2026"},
		{BuyerID: "BUY-04", Name: "Kenji Watanabe", Company: "Sakura Basics", Country: "Japan", Contact: "kenji@sakurabasics.jp", Active: 3, Completed: 6, Delayed: 0, Total: 9, LastOrder: "05 Sep 2026"},
		{BuyerID: "BUY-05", Name: "Leon Fischer", Company: "Berlin Urban Wear", Country: "Germany", Contact: "leon@berlinurban.de", Active: 3, Completed: 3, Delayed: 0, Total: 6, LastOrder: "01 Sep 2026"},
	}
}

func getInitialOrders() []models.Order {
	now := time.Now()
	return []models.Order{
		{
			OrderID: "ORD-001", BuyerID: "BUY-01", Buyer: "ABC Fashion", Product: "Cotton T-Shirt", Category: "Knitwear",
			StyleNo: "ST-8801", PONo: "PO-9941", Quantity: 10000, Fabric: "100% Combed Cotton 180 GSM", Color: "Navy Blue",
			StartDate: "01 Sep 2026", DeliveryDate: "20 Sep 2026", Priority: "High", Status: "On Track", CurrentStage: "sewing", Progress: 78,
			CreatedAt: now, UpdatedAt: now,
			Stages: buildStageRecords(10000, "sewing", 78),
		},
		{
			OrderID: "ORD-002", BuyerID: "BUY-02", Buyer: "Northline Apparel", Product: "Polo T-Shirt", Category: "Knitwear",
			StyleNo: "ST-8802", PONo: "PO-9942", Quantity: 6500, Fabric: "Pique Cotton 220 GSM", Color: "Heather Grey",
			StartDate: "03 Sep 2026", DeliveryDate: "28 Sep 2026", Priority: "Medium", Status: "On Track", CurrentStage: "dyeing", Progress: 35,
			CreatedAt: now, UpdatedAt: now,
			Stages: buildStageRecords(6500, "dyeing", 35),
		},
		{
			OrderID: "ORD-003", BuyerID: "BUY-03", Buyer: "Lisboa Knitwear", Product: "Hoodie", Category: "Fleece",
			StyleNo: "ST-8803", PONo: "PO-9943", Quantity: 4200, Fabric: "3-Thread Fleece 320 GSM", Color: "Black",
			StartDate: "25 Aug 2026", DeliveryDate: "14 Sep 2026", Priority: "High", Status: "On Track", CurrentStage: "packing", Progress: 92,
			CreatedAt: now, UpdatedAt: now,
			Stages: buildStageRecords(4200, "packing", 92),
		},
		{
			OrderID: "ORD-004", BuyerID: "BUY-04", Buyer: "Sakura Basics", Product: "Track Pant", Category: "Bottoms",
			StyleNo: "ST-8804", PONo: "PO-9944", Quantity: 8000, Fabric: "French Terry 280 GSM", Color: "Olive Green",
			StartDate: "05 Sep 2026", DeliveryDate: "30 Sep 2026", Priority: "Medium", Status: "At Risk", CurrentStage: "cutting", Progress: 50,
			CreatedAt: now, UpdatedAt: now,
			Stages: buildStageRecords(8000, "cutting", 50),
		},
	}
}

func buildStageRecords(qty int, currentStage string, progress int) []models.StageRecord {
	stages := []string{"yarn", "knitting", "dyeing", "compacting", "cutting", "printing", "sewing", "ironing", "packing"}
	labels := map[string]string{
		"yarn": "Yarn", "knitting": "Knitting", "dyeing": "Dyeing", "compacting": "Compacting",
		"cutting": "Cutting", "printing": "Printing", "sewing": "Sewing", "ironing": "Ironing", "packing": "Packing",
	}
	managers := []string{"Raj Kumar", "Selvi Meenakshi", "Arun Prakash", "Divya Rani", "Karthik S", "Bhuvana R", "Muthu Velan", "Lakshmi Priya", "Ganesh Iyer"}

	currIdx := 0
	for i, s := range stages {
		if s == currentStage {
			currIdx = i
			break
		}
	}

	var records []models.StageRecord
	for i, s := range stages {
		isDone := i < currIdx || progress == 100
		isCurrent := i == currIdx && progress < 100
		stProgress := 0
		if isDone {
			stProgress = 100
		} else if isCurrent {
			stProgress = progress
		}
		completed := (qty * stProgress) / 100
		state := "pending"
		if isDone {
			state = "completed"
		} else if isCurrent {
			state = "current"
		}

		records = append(records, models.StageRecord{
			Key:       s,
			Label:     labels[s],
			State:     state,
			Target:    qty,
			Completed: completed,
			Pending:   qty - completed,
			Rejected:  int(float64(qty) * 0.012),
			Progress:  stProgress,
			Rate:      1800 + i*150,
			Manager:   managers[i],
			Expected:  "20 Sep 2026",
		})
	}
	return records
}

func getInitialInventory() []models.InventoryItem {
	return []models.InventoryItem{
		{ItemID: "INV-01", Material: "Cotton Yarn 30s", Category: "Yarn", Stock: 1450, Unit: "kg", MinRequired: 2000, Status: "Low Stock", CoverDays: 6, Supplier: "Coimbatore Spinners", LastUpdate: "10 Sep 2026"},
		{ItemID: "INV-02", Material: "Polyester Yarn 40s", Category: "Yarn", Stock: 3200, Unit: "kg", MinRequired: 1500, Status: "In Stock", CoverDays: 14, Supplier: "Reliance Fibres", LastUpdate: "09 Sep 2026"},
		{ItemID: "INV-03", Material: "Reactive Dye Navy", Category: "Chemicals", Stock: 180, Unit: "kg", MinRequired: 100, Status: "In Stock", CoverDays: 12, Supplier: "Dystar India", LastUpdate: "08 Sep 2026"},
		{ItemID: "INV-04", Material: "Polyester Thread White", Category: "Trims", Stock: 45, Unit: "spools", MinRequired: 150, Status: "Critical", CoverDays: 2, Supplier: "Coats India", LastUpdate: "10 Sep 2026"},
		{ItemID: "INV-05", Material: "Woven Labels - ABC", Category: "Trims", Stock: 12000, Unit: "pcs", MinRequired: 5000, Status: "In Stock", CoverDays: 20, Supplier: "TrimTech Ltd", LastUpdate: "05 Sep 2026"},
	}
}

func getInitialNotifications() []models.NotificationItem {
	return []models.NotificationItem{
		{NotifID: "N-1", Title: "Sewing Bottleneck Alert", Message: "Order ORD-001 sewing output at 78%. Sewing capacity gap detected.", Type: "warning", Time: "10 mins ago", Read: false, Role: "admin"},
		{NotifID: "N-2", Title: "Low Yarn Cover", Message: "Cotton Yarn 30s stock is down to 6 days cover.", Type: "danger", Time: "1 hour ago", Read: false, Role: "admin"},
		{NotifID: "N-3", Title: "Order ORD-003 Packing Near Completion", Message: "Hoodies for Lisboa Knitwear are 92% packed and ready for QA.", Type: "success", Time: "3 hours ago", Read: true, Role: "buyer"},
	}
}

func getInitialAIInsights() []models.AIInsight {
	return []models.AIInsight{
		{InsightID: "INS-01", Severity: "high", Stage: "sewing", Title: "Sewing Bottleneck on Order ORD-001", Description: "Sewing rate is 1,850 pcs/day against target 2,400 pcs/day.", Action: "Shift 4 sewing operators from Line 2 to Line 5 to absorb 550 pcs/day deficit.", Impact: "Prevents 3-day delivery delay for ABC Fashion.", OrderID: "ORD-001"},
		{InsightID: "INS-02", Severity: "medium", Stage: "yarn", Title: "Raw Material Shortage Risk", Description: "Cotton Yarn 30s cover is 6 days. Next scheduled delivery is in 9 days.", Action: "Issue urgent purchase order to Coimbatore Spinners for 1,000 kg.", Impact: "Avoids 2-day knitting line halt.", OrderID: "ORD-002"},
	}
}
