import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to generate IDs
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getAppointmentDate(appointment: any): string | null {
  if (typeof appointment?.date === "string" && appointment.date.length >= 10) {
    return appointment.date.slice(0, 10);
  }

  if (typeof appointment?.start_time === "string" && appointment.start_time.length >= 10) {
    return appointment.start_time.slice(0, 10);
  }

  if (typeof appointment?.startTime === "string") {
    if (appointment.startTime.length >= 10 && appointment.startTime.includes("-")) {
      return appointment.startTime.slice(0, 10);
    }
    if (typeof appointment?.date === "string" && appointment.date.length >= 10) {
      return appointment.date.slice(0, 10);
    }
  }

  return null;
}

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// BARBERS ENDPOINTS
// ============================================

// Get all barbers
app.get("/barbers", async (c) => {
  try {
    const barbers = await kv.getByPrefix("barber:");
    return c.json(barbers);
  } catch (error) {
    console.error("Error fetching barbers:", error);
    return c.json({ error: "Failed to fetch barbers" }, 500);
  }
});

// Create barber
app.post("/barbers", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const barber = {
      id,
      ...body,
      created_at: new Date().toISOString(),
    };
    await kv.set(`barber:${id}`, barber);
    return c.json(barber, 201);
  } catch (error) {
    console.error("Error creating barber:", error);
    return c.json({ error: "Failed to create barber" }, 500);
  }
});

// Update barber
app.put("/barbers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`barber:${id}`);
    if (!existing) {
      return c.json({ error: "Barber not found" }, 404);
    }
    const updated = { ...existing, ...body };
    await kv.set(`barber:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating barber:", error);
    return c.json({ error: "Failed to update barber" }, 500);
  }
});

// Delete barber
app.delete("/barbers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`barber:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting barber:", error);
    return c.json({ error: "Failed to delete barber" }, 500);
  }
});

// ============================================
// SERVICES ENDPOINTS
// ============================================

// Get all services
app.get("/services", async (c) => {
  try {
    const services = await kv.getByPrefix("service:");
    return c.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return c.json({ error: "Failed to fetch services" }, 500);
  }
});

// Create service
app.post("/services", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    const service = {
      id,
      ...body,
      created_at: new Date().toISOString(),
    };
    await kv.set(`service:${id}`, service);
    return c.json(service, 201);
  } catch (error) {
    console.error("Error creating service:", error);
    return c.json({ error: "Failed to create service" }, 500);
  }
});

// Update service
app.put("/services/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`service:${id}`);
    if (!existing) {
      return c.json({ error: "Service not found" }, 404);
    }
    const updated = { ...existing, ...body };
    await kv.set(`service:${id}`, updated);
    return c.json(updated);
  } catch (error) {
    console.error("Error updating service:", error);
    return c.json({ error: "Failed to update service" }, 500);
  }
});

// Delete service
app.delete("/services/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`service:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return c.json({ error: "Failed to delete service" }, 500);
  }
});

// ============================================
// APPOINTMENTS ENDPOINTS
// ============================================

// Get appointments (with optional filters)
app.get("/appointments", async (c) => {
  try {
    const date = c.req.query("date");
    const barber_id = c.req.query("barber_id");
    const status = c.req.query("status");
    
    let appointments = await kv.getByPrefix("appointment:");
    
    // Apply filters
    if (date) {
      appointments = appointments.filter((apt: any) => 
        getAppointmentDate(apt) === date
      );
    }
    if (barber_id) {
      appointments = appointments.filter((apt: any) => 
        apt.barber_id === barber_id
      );
    }
    if (status) {
      appointments = appointments.filter((apt: any) => 
        apt.status === status
      );
    }
    
    return c.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return c.json({ error: "Failed to fetch appointments" }, 500);
  }
});

// Create appointment
app.post("/appointments", async (c) => {
  try {
    const body = await c.req.json();
    const id = generateId();
    
    // Check for double booking
    const existingAppointments = await kv.getByPrefix("appointment:");
    const hasConflict = existingAppointments.some((apt: any) => {
      if (apt.barber_id !== body.barber_id) return false;
      if (apt.status === 'cancelled') return false;
      
      const aptStart = new Date(apt.start_time).getTime();
      const aptEnd = new Date(apt.end_time).getTime();
      const newStart = new Date(body.start_time).getTime();
      const newEnd = new Date(body.end_time).getTime();
      
      return (newStart < aptEnd && newEnd > aptStart);
    });
    
    if (hasConflict) {
      return c.json({ error: "Time slot is already booked" }, 409);
    }
    
    const appointment = {
      id,
      ...body,
      created_at: new Date().toISOString(),
    };
    
    await kv.set(`appointment:${id}`, appointment);
    
    // Update customer record
    const customerId = body.customer_id || id;
    const customer = await kv.get(`customer:${customerId}`) || {
      id: customerId,
      name: body.customer_name,
      phone: body.customer_phone,
      email: body.customer_email || '',
      total_visits: 0,
      total_spent: 0,
      created_at: new Date().toISOString(),
    };
    
    customer.total_visits = (customer.total_visits || 0) + 1;
    customer.last_visit = body.start_time;
    await kv.set(`customer:${customerId}`, customer);
    
    return c.json(appointment, 201);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return c.json({ error: "Failed to create appointment" }, 500);
  }
});

// Update appointment
app.put("/appointments/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await kv.get(`appointment:${id}`);
    
    if (!existing) {
      return c.json({ error: "Appointment not found" }, 404);
    }
    
    const updated = { ...existing, ...body };
    await kv.set(`appointment:${id}`, updated);
    
    // Update customer total_spent when appointment is completed
    if (body.status === 'completed' && existing.status !== 'completed') {
      const customerId = existing.customer_id;
      if (customerId) {
        const customer = await kv.get(`customer:${customerId}`);
        if (customer) {
          customer.total_spent = (customer.total_spent || 0) + existing.total_price;
          await kv.set(`customer:${customerId}`, customer);
        }
      }
    }
    
    return c.json(updated);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return c.json({ error: "Failed to update appointment" }, 500);
  }
});

// Delete appointment
app.delete("/appointments/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`appointment:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return c.json({ error: "Failed to delete appointment" }, 500);
  }
});

// ============================================
// AVAILABILITY CHECK
// ============================================

app.get("/availability/:barberId", async (c) => {
  try {
    const barberId = c.req.param("barberId");
    const date = c.req.query("date");
    const duration = parseInt(c.req.query("duration") || "30");
    
    const barber = await kv.get(`barber:${barberId}`);
    if (!barber) {
      return c.json({ error: "Barber not found" }, 404);
    }
    
    const appointments = await kv.getByPrefix("appointment:");
    const barberAppointments = appointments.filter((apt: any) => 
      apt.barber_id === barberId && 
      apt.start_time.startsWith(date) &&
      apt.status !== 'cancelled'
    );
    
    // Get working hours for the day
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const workingHour = barber.working_hours.find((wh: any) => wh.day === dayOfWeek);
    
    if (!workingHour || !workingHour.is_working) {
      return c.json({ available: false, message: "Barber is not working on this day" });
    }
    
    // Generate available time slots
    const slots = [];
    const startTime = new Date(`${date}T${workingHour.start}`);
    const endTime = new Date(`${date}T${workingHour.end}`);
    
    let currentSlot = new Date(startTime);
    while (currentSlot.getTime() + duration * 60000 <= endTime.getTime()) {
      const slotEnd = new Date(currentSlot.getTime() + duration * 60000);
      
      // Check if slot conflicts with existing appointments
      const hasConflict = barberAppointments.some((apt: any) => {
        const aptStart = new Date(apt.start_time).getTime();
        const aptEnd = new Date(apt.end_time).getTime();
        const slotStart = currentSlot.getTime();
        const slotEndTime = slotEnd.getTime();
        
        return (slotStart < aptEnd && slotEndTime > aptStart);
      });
      
      if (!hasConflict) {
        slots.push({
          start: currentSlot.toISOString(),
          end: slotEnd.toISOString(),
        });
      }
      
      currentSlot = new Date(currentSlot.getTime() + 30 * 60000); // Move by 30 minutes
    }
    
    return c.json({ available: true, slots });
  } catch (error) {
    console.error("Error checking availability:", error);
    return c.json({ error: "Failed to check availability" }, 500);
  }
});

// ============================================
// CUSTOMERS ENDPOINTS
// ============================================

app.get("/customers", async (c) => {
  try {
    const customers = await kv.getByPrefix("customer:");
    return c.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return c.json({ error: "Failed to fetch customers" }, 500);
  }
});

// Create customer
app.post("/customers", async (c) => {
  try {
    const body = await c.req.json();
    const customer = {
      ...body,
      created_at: body.createdAt || new Date().toISOString(),
    };
    await kv.set(`customer:${customer.id}`, customer);
    return c.json(customer, 201);
  } catch (error) {
    console.error("Error creating customer:", error);
    return c.json({ error: "Failed to create customer" }, 500);
  }
});

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

app.get("/analytics", async (c) => {
  try {
    const start_date = c.req.query("start_date");
    const end_date = c.req.query("end_date");
    
    let appointments = await kv.getByPrefix("appointment:");
    const barbers = await kv.getByPrefix("barber:");
    const customers = await kv.getByPrefix("customer:");

    if (start_date || end_date) {
      appointments = appointments.filter((apt: any) => {
        const datePart = getAppointmentDate(apt);
        if (!datePart) return false;
        if (start_date && datePart < start_date) return false;
        if (end_date && datePart > end_date) return false;
        return true;
      });
    }
    
    // Calculate analytics
    const completedAppointments = appointments.filter((apt: any) => 
      apt.status === 'completed'
    );
    
    const totalRevenue = completedAppointments.reduce(
      (sum: number, apt: any) => sum + (apt.total_price || 0), 
      0
    );
    
    const activeBarbers = new Set(
      appointments
        .map((apt: any) => apt.barber_id)
        .filter((id: any) => typeof id === "string" && id.length > 0)
    ).size;

    const revenueByDayMap = new Map<string, { date: string; revenue: number; appointments: number }>();
    for (const apt of completedAppointments) {
      const dateKey = getAppointmentDate(apt);
      if (!dateKey) continue;
      const existing = revenueByDayMap.get(dateKey) || {
        date: dateKey,
        revenue: 0,
        appointments: 0,
      };
      existing.revenue += apt.total_price || 0;
      existing.appointments += 1;
      revenueByDayMap.set(dateKey, existing);
    }

    const revenueByServiceMap = new Map<string, number>();
    for (const apt of completedAppointments) {
      const titles = Array.isArray(apt.service_titles) ? apt.service_titles : [];
      if (titles.length === 0) {
        revenueByServiceMap.set("Uncategorized", (revenueByServiceMap.get("Uncategorized") || 0) + (apt.total_price || 0));
        continue;
      }
      const share = (apt.total_price || 0) / titles.length;
      for (const title of titles) {
        revenueByServiceMap.set(title, (revenueByServiceMap.get(title) || 0) + share);
      }
    }

    const barberRevenueMap = new Map<string, { name: string; revenue: number; appointments: number; commission: number }>();
    for (const apt of completedAppointments) {
      const barberId = apt.barber_id || apt.barber_name || "unknown";
      const barberName = apt.barber_name || barbers.find((barber: any) => barber.id === apt.barber_id)?.name || "Unknown";
      const existing = barberRevenueMap.get(barberId) || {
        name: barberName,
        revenue: 0,
        appointments: 0,
        commission: 0,
      };
      existing.revenue += apt.total_price || 0;
      existing.appointments += 1;
      const commissionRate = Number(
        barbers.find((barber: any) => barber.id === apt.barber_id)?.commission_rate ?? 50,
      );
      existing.commission = existing.revenue * (commissionRate / 100);
      barberRevenueMap.set(barberId, existing);
    }

    const topBarbers = Array.from(barberRevenueMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const revenueByDay = Array.from(revenueByDayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const revenueByServiceRaw = Array.from(revenueByServiceMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const revenueByService = revenueByServiceRaw.map((entry) => ({
      ...entry,
      percentage: totalRevenue > 0 ? Number(((entry.value / totalRevenue) * 100).toFixed(1)) : 0,
    }));
    
    return c.json({
      total_revenue: totalRevenue,
      total_appointments: appointments.length,
      completed_appointments: completedAppointments.length,
      active_barbers: activeBarbers,
      total_customers: customers.length,
      avg_appointment_value: completedAppointments.length > 0 
        ? totalRevenue / completedAppointments.length 
        : 0,
      revenue_growth: 0,
      appointment_growth: 0,
      revenue_by_day: revenueByDay,
      revenue_by_service: revenueByService,
      top_barbers: topBarbers,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

Deno.serve(app.fetch);
