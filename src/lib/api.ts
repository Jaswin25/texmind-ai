import { Order, orders as seedOrders, Buyer, buyers as seedBuyers, materials as seedMaterials } from "./data";

export const API_BASE_URL = "http://localhost:8082/api/v1";

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return seedOrders;
  } catch (err) {
    console.warn("[API] Go backend unreachable, using fallback seed orders:", err);
    return seedOrders;
  }
}

export async function createOrderAPI(order: Order): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return { success: true, data: json.data || order };
  } catch (err: any) {
    console.error("[API Error] Failed to create order in MongoDB:", err);
    return { success: false, error: err.message };
  }
}

export async function fetchBuyers(): Promise<Buyer[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/buyers`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return seedBuyers;
  } catch (err) {
    return seedBuyers;
  }
}

export async function fetchInventory() {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return seedMaterials;
  } catch (err) {
    return seedMaterials;
  }
}
