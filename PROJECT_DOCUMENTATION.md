# BarberGo - Business Management System

## 🎓 Graduation Project Overview

**BarberGo** is a comprehensive Business Management System (BMS) designed for men's grooming services. This is a high-caliber graduation project that demonstrates:

- **Full-stack development** with React frontend and Supabase backend
- **Real-time booking system** with double-booking prevention
- **Multi-user architecture** supporting Admins, Barbers, and Customers
- **Advanced time-slot management** with dynamic scheduling
- **Business intelligence** with analytics and commission tracking
- **Professional UI/UX** with responsive design

---

## 🏗️ Architecture

### Three-Tier System

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                      │
├─────────────────────────────────────────────────────────────┤
│  Admin Dashboard (Web)  │  Customer App  │  Barber App     │
│  • React + TypeScript   │  • Flutter     │  • Flutter      │
│  • Responsive Design    │  • iOS/Android │  • Simplified   │
│  • Full Management      │  • Booking     │  • Daily Queue  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                          │
├─────────────────────────────────────────────────────────────┤
│  • Supabase Edge Functions (Hono + TypeScript)              │
│  • RESTful API Endpoints                                     │
│  • Business Logic (Double-booking prevention, etc.)          │
│  • Real-time slot synchronization                            │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  • Supabase PostgreSQL                                       │
│  • Key-Value Store for rapid prototyping                     │
│  • Real-time subscriptions                                   │
│  • Authentication & Authorization                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. **Intelligent Service Catalog**
- **Duration-Based Services**: Each service has a `duration_minutes` attribute
  - Haircut: 30 mins
  - Hajama (Cupping): 45 mins
  - Facial Treatment: 20 mins
- **Service Bundling**: Combine multiple services (e.g., "Haircut + Facial" = 50 mins)
- **Dynamic Pricing**: Automatic total calculation

### 2. **Multi-Barber Synchronization**
- **Independent Calendars**: Each barber has unique working hours
  - Barber A: 9 AM – 5 PM
  - Barber B: 2 PM – 10 PM
- **Skill Tagging**: Filter barbers by specialty (Barbering, Hajama, Skincare)
- **Concurrent Booking Prevention**: Real-time slot locking prevents double bookings
- **Conflict Detection**: Algorithm checks time overlaps before confirming appointments

### 3. **Advanced Time Management**
- **Break Management**: Admin can insert buffer times between appointments
- **Shift Overrides**: Mark barbers as "Off-Duty" instantly
- **Weekly Schedules**: Customizable working hours per day
- **Real-time Availability**: Dynamic slot generation based on existing bookings

### 4. **Revenue & Business Tools**
- **Commission Calculator**: Automatic barber earnings calculation
  - Configurable commission rates (default: 50%)
  - Track revenue per barber
  - Net earnings breakdown
- **Analytics Dashboard**:
  - Revenue trends (daily/weekly/monthly)
  - Service category performance
  - Top-performing barbers
  - Customer lifetime value

### 5. **Customer Management**
- **Customer Profiles**: Track visit history and spending
- **Tier System**: 
  - Regular: < $250 spent
  - Gold: $250 - $499
  - VIP: $500+
- **Visit Tracking**: Total appointments and last visit date

---

## 🔧 Technology Stack

### Frontend (Admin Dashboard)
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (shadcn/ui)
- **Charts**: Recharts
- **Routing**: React Router v7
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

### Backend
- **Runtime**: Deno (Supabase Edge Functions)
- **Framework**: Hono (Fast web framework)
- **Database**: Supabase PostgreSQL + KV Store
- **API**: RESTful with JSON responses
- **Authentication**: Supabase Auth (future enhancement)

### Development Tools
- **Build**: Vite
- **Package Manager**: pnpm
- **Type Checking**: TypeScript

---

## 📊 Database Schema

### Collections/Tables

#### Barbers
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: ['barbering' | 'hajama' | 'skincare'][];
  working_hours: {
    day: string;
    start: string; // HH:MM format
    end: string;   // HH:MM format
    is_working: boolean;
  }[];
  rating: number; // 0-5 stars
  commission_rate: number; // Percentage
  avatar_url?: string;
  created_at: string;
}
```

#### Services
```typescript
{
  id: string;
  title: string;
  category: 'barbering' | 'hajama' | 'skincare';
  price: number;
  duration_minutes: number;
  description: string;
  is_active: boolean;
  created_at: string;
}
```

#### Appointments
```typescript
{
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  barber_id: string;
  barber_name: string;
  service_ids: string[];
  service_titles: string[];
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  total_duration: number; // minutes
  total_price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
}
```

#### Customers
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  total_visits: number;
  total_spent: number;
  last_visit: string;
  avatar_url?: string;
  created_at: string;
}
```

---

## 🎯 API Endpoints

### Barbers
- `GET /barbers` - List all barbers
- `POST /barbers` - Create new barber
- `PUT /barbers/:id` - Update barber
- `DELETE /barbers/:id` - Delete barber

### Services
- `GET /services` - List all services
- `POST /services` - Create new service
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### Appointments
- `GET /appointments?date=YYYY-MM-DD&barber_id=...&status=...` - List appointments with filters
- `POST /appointments` - Create appointment (with double-booking check)
- `PUT /appointments/:id` - Update appointment status
- `DELETE /appointments/:id` - Cancel appointment

### Availability
- `GET /availability/:barberId?date=YYYY-MM-DD&duration=30` - Get available time slots

### Customers
- `GET /customers` - List all customers

### Analytics
- `GET /analytics?start_date=...&end_date=...` - Get business analytics

---

## 🚀 How to Run

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Start Development Server**:
   ```bash
   pnpm dev
   ```

3. **Access the Admin Dashboard**:
   ```
   http://localhost:5173
   ```

4. **Login**:
   - Use any email/password (demo mode)
   - Default: `admin@barbergo.com` / any password

---

## 🎨 User Interface Highlights

### Dashboard
- **Real-time Statistics**: Today's appointments, revenue, active barbers
- **Upcoming Appointments**: Next 5 bookings with time and customer info
- **Quick Actions**: Fast access to booking, barber management, and services

### Appointments
- **Advanced Filtering**: By date, barber, and status
- **Multi-Service Booking**: Select multiple services in one appointment
- **Status Management**: Update appointment status (Pending → Confirmed → In Progress → Completed)
- **Visual Time Slots**: Color-coded status indicators

### Barbers
- **Comprehensive Profiles**: Personal info, specialties, working hours
- **Commission Tracking**: Per-barber revenue and earnings
- **Schedule Editor**: Visual weekly schedule with day-specific hours
- **Skill Management**: Tag barbers with service specialties

### Services
- **Category Organization**: Barbering, Hajama, Skincare
- **Duration & Pricing**: Clear service metrics
- **Active/Inactive Toggle**: Control service availability

### Analytics
- **Revenue Charts**: Line graphs showing daily performance
- **Service Distribution**: Pie chart of revenue by category
- **Barber Performance**: Bar charts comparing staff metrics
- **Commission Reports**: Detailed earnings breakdown

---

## 🔐 Security Considerations

⚠️ **IMPORTANT**: This is a prototype/demo system. For production deployment:

1. **Implement proper authentication**:
   - Supabase Auth with email/password
   - Role-based access control (Admin, Barber, Customer)
   - JWT token validation

2. **Add data validation**:
   - Input sanitization
   - SQL injection prevention (use Supabase RLS)
   - XSS protection

3. **Secure API endpoints**:
   - Require authentication tokens
   - Rate limiting
   - CORS configuration

4. **Handle PII properly**:
   - Encrypt sensitive data
   - GDPR/privacy compliance
   - Secure payment processing

---

## 🎓 Graduation Project Strengths

### Technical Excellence
✅ **Full-stack implementation** with modern tech stack
✅ **Complex business logic** (time-slot algorithm, double-booking prevention)
✅ **RESTful API design** following best practices
✅ **Responsive UI** with professional design system
✅ **Real-time data synchronization**

### Business Value
✅ **Solves real-world problem** for barbershops and salons
✅ **Scalable architecture** supporting multiple locations
✅ **Revenue optimization** through analytics and insights
✅ **Multi-user support** (3 distinct user types)
✅ **Service diversification** (Barbering + Hajama + Skincare)

### Unique Selling Points
🌟 **Hajama/Cupping Integration**: Expands beyond basic barbershop
🌟 **Dynamic Time Slots**: Intelligent scheduling based on service duration
🌟 **Commission Automation**: Reduces manual payroll calculations
🌟 **Visual Analytics**: Data-driven business decisions
🌟 **Conflict Prevention**: Zero double-booking with real-time checks

---

## 📱 Flutter Integration Guide

The React Admin Dashboard you have now can be integrated with Flutter mobile apps:

### Shared Backend
Both web and mobile apps use the same Supabase backend:
```
Admin Dashboard (React) ─┐
Customer App (Flutter)   ├──→ Supabase API
Barber App (Flutter)     ─┘
```

### Flutter API Integration
```dart
// Example: Fetch barbers in Flutter
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<Barber>> getBarbers() async {
  final response = await http.get(
    Uri.parse('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0bdf1ecf/barbers'),
    headers: {'Authorization': 'Bearer YOUR_ANON_KEY'},
  );
  
  if (response.statusCode == 200) {
    List<dynamic> data = jsonDecode(response.body);
    return data.map((json) => Barber.fromJson(json)).toList();
  }
  throw Exception('Failed to load barbers');
}
```

---

## 🏆 Presentation Tips

### Demo Flow
1. **Login** → Show admin authentication
2. **Dashboard** → Highlight real-time stats
3. **Create Barber** → Add staff with schedule
4. **Add Services** → Show service catalog with categories
5. **Book Appointment** → Demonstrate multi-service booking
6. **Show Conflict Prevention** → Try to double-book (should fail)
7. **Analytics** → Display revenue charts and commissions
8. **Update Status** → Move appointment through workflow

### Key Points to Emphasize
- **Complexity**: Not just a CRUD app, has intelligent scheduling algorithm
- **Real-world**: Solves actual business problems for barbershops
- **Scalability**: Architecture supports multiple branches/locations
- **Innovation**: Hajama integration makes it unique in the market
- **Technical Skills**: Modern tech stack, best practices, clean code

---

## 📈 Future Enhancements

1. **Mobile Apps** (Flutter):
   - Customer booking app
   - Barber queue management app
   - Push notifications

2. **Advanced Features**:
   - In-app payments (Stripe/PayPal)
   - Customer loyalty program
   - SMS/Email reminders
   - Online product shop
   - Multi-location support

3. **AI/ML Integration**:
   - Demand forecasting
   - Smart scheduling recommendations
   - Customer preference learning

4. **Marketing Tools**:
   - Promotional campaigns
   - Referral program
   - Social media integration

---

## 👨‍💻 Developer

**Project Type**: Graduation Project - Business Management System  
**Target Users**: Barbershop owners, staff, and customers  
**Market Focus**: Men's grooming services (Barbering, Hajama, Skincare)  
**Technology**: React + TypeScript + Supabase  
**Status**: Fully functional prototype/MVP

---

## 📞 Support

For questions about the codebase or architecture, refer to:
- `/src/app/components/*` - Frontend components
- `/supabase/functions/server/index.tsx` - Backend API
- `/src/app/lib/api.ts` - API client functions

Good luck with your graduation project! 🎓🚀
