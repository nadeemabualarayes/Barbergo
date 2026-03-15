# BarberGo API Reference

Base URL: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-0bdf1ecf`

## Authentication

All requests require the `Authorization` header:
```
Authorization: Bearer YOUR_ANON_KEY
```

---

## Barbers

### List All Barbers
```http
GET /barbers
```

**Response**: `200 OK`
```json
[
  {
    "id": "1234567890-abc123",
    "name": "Mohammed Al-Rashid",
    "email": "mohammed@barbergo.com",
    "phone": "+966 50 123 4567",
    "specialties": ["barbering", "hajama"],
    "working_hours": [
      {
        "day": "Monday",
        "start": "09:00",
        "end": "18:00",
        "is_working": true
      }
    ],
    "rating": 4.8,
    "commission_rate": 50,
    "created_at": "2026-03-15T10:00:00Z"
  }
]
```

### Create Barber
```http
POST /barbers
Content-Type: application/json

{
  "name": "Youssef Ibrahim",
  "email": "youssef@barbergo.com",
  "phone": "+966 55 987 6543",
  "specialties": ["barbering", "skincare"],
  "commission_rate": 55,
  "working_hours": [
    {
      "day": "Monday",
      "start": "14:00",
      "end": "22:00",
      "is_working": true
    }
  ]
}
```

**Response**: `201 Created`

### Update Barber
```http
PUT /barbers/:id
Content-Type: application/json

{
  "commission_rate": 60,
  "rating": 4.9
}
```

**Response**: `200 OK`

### Delete Barber
```http
DELETE /barbers/:id
```

**Response**: `200 OK`
```json
{ "success": true }
```

---

## Services

### List All Services
```http
GET /services
```

**Response**: `200 OK`
```json
[
  {
    "id": "1234567890-xyz789",
    "title": "Classic Haircut",
    "category": "barbering",
    "price": 30,
    "duration_minutes": 30,
    "description": "Professional haircut with styling",
    "is_active": true,
    "created_at": "2026-03-15T10:00:00Z"
  }
]
```

### Create Service
```http
POST /services
Content-Type: application/json

{
  "title": "Hajama (Cupping Therapy)",
  "category": "hajama",
  "price": 60,
  "duration_minutes": 45,
  "description": "Traditional cupping therapy for wellness",
  "is_active": true
}
```

**Response**: `201 Created`

### Update Service
```http
PUT /services/:id
Content-Type: application/json

{
  "price": 65,
  "is_active": false
}
```

**Response**: `200 OK`

### Delete Service
```http
DELETE /services/:id
```

**Response**: `200 OK`

---

## Appointments

### List Appointments
```http
GET /appointments
GET /appointments?date=2026-03-15
GET /appointments?barber_id=1234567890-abc123
GET /appointments?status=confirmed
GET /appointments?date=2026-03-15&barber_id=1234567890-abc123&status=pending
```

**Query Parameters**:
- `date` (optional): Filter by date (YYYY-MM-DD)
- `barber_id` (optional): Filter by barber ID
- `status` (optional): Filter by status (pending|confirmed|in_progress|completed|cancelled)

**Response**: `200 OK`
```json
[
  {
    "id": "1234567890-apt001",
    "customer_id": "1234567890-cust001",
    "customer_name": "Ahmed Ali",
    "customer_phone": "+966 50 123 4567",
    "barber_id": "1234567890-abc123",
    "barber_name": "Mohammed",
    "service_ids": ["service1", "service2"],
    "service_titles": ["Haircut", "Beard Trim"],
    "start_time": "2026-03-15T10:00:00Z",
    "end_time": "2026-03-15T10:45:00Z",
    "total_duration": 45,
    "total_price": 45,
    "status": "confirmed",
    "payment_status": "paid",
    "notes": "Customer prefers short sides",
    "created_at": "2026-03-14T15:30:00Z"
  }
]
```

### Create Appointment
```http
POST /appointments
Content-Type: application/json

{
  "customer_name": "Ahmed Ali",
  "customer_phone": "+966 50 123 4567",
  "customer_email": "ahmed@email.com",
  "barber_id": "1234567890-abc123",
  "barber_name": "Mohammed",
  "service_ids": ["service1", "service2"],
  "service_titles": ["Haircut", "Beard Trim"],
  "start_time": "2026-03-15T10:00:00Z",
  "end_time": "2026-03-15T10:45:00Z",
  "total_duration": 45,
  "total_price": 45,
  "status": "pending",
  "payment_status": "pending",
  "notes": "Customer prefers short sides"
}
```

**Response**: `201 Created` (on success)

**Error Response**: `409 Conflict` (if time slot already booked)
```json
{
  "error": "Time slot is already booked"
}
```

**Important**: The backend automatically:
- Checks for double-booking conflicts
- Creates/updates customer record
- Increments customer visit count

### Update Appointment
```http
PUT /appointments/:id
Content-Type: application/json

{
  "status": "completed",
  "payment_status": "paid"
}
```

**Response**: `200 OK`

**Important**: When status changes to "completed", the customer's `total_spent` is automatically updated.

### Delete Appointment
```http
DELETE /appointments/:id
```

**Response**: `200 OK`

---

## Availability

### Check Barber Availability
```http
GET /availability/:barberId?date=2026-03-15&duration=30
```

**Query Parameters**:
- `date` (required): Date to check (YYYY-MM-DD)
- `duration` (optional): Service duration in minutes (default: 30)

**Response**: `200 OK` (if barber is working)
```json
{
  "available": true,
  "slots": [
    {
      "start": "2026-03-15T09:00:00Z",
      "end": "2026-03-15T09:30:00Z"
    },
    {
      "start": "2026-03-15T09:30:00Z",
      "end": "2026-03-15T10:00:00Z"
    },
    {
      "start": "2026-03-15T11:00:00Z",
      "end": "2026-03-15T11:30:00Z"
    }
  ]
}
```

**Response**: `200 OK` (if barber is not working)
```json
{
  "available": false,
  "message": "Barber is not working on this day"
}
```

**Algorithm**:
1. Fetches barber's working hours for the specified day
2. Retrieves all existing appointments for that barber on that date
3. Generates time slots in 30-minute intervals
4. Filters out slots that conflict with existing bookings
5. Returns only available slots

---

## Customers

### List All Customers
```http
GET /customers
```

**Response**: `200 OK`
```json
[
  {
    "id": "1234567890-cust001",
    "name": "Ahmed Ali",
    "email": "ahmed@email.com",
    "phone": "+966 50 123 4567",
    "total_visits": 12,
    "total_spent": 540,
    "last_visit": "2026-03-13T14:00:00Z",
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

**Note**: Customer records are automatically created/updated when appointments are made or completed.

---

## Analytics

### Get Business Analytics
```http
GET /analytics
GET /analytics?start_date=2026-03-01&end_date=2026-03-31
```

**Query Parameters**:
- `start_date` (optional): Filter start date
- `end_date` (optional): Filter end date

**Response**: `200 OK`
```json
{
  "total_revenue": 12450,
  "total_appointments": 156,
  "completed_appointments": 132,
  "active_barbers": 4,
  "avg_appointment_value": 79.81
}
```

**Calculations**:
- `total_revenue`: Sum of all completed appointments' prices
- `total_appointments`: Count of all appointments
- `completed_appointments`: Count of appointments with status "completed"
- `active_barbers`: Unique barbers with at least one appointment
- `avg_appointment_value`: Total revenue / completed appointments

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 404 Not Found
```json
{
  "error": "Barber not found"
}
```

### 409 Conflict
```json
{
  "error": "Time slot is already booked"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create appointment"
}
```

---

## Double-Booking Prevention Algorithm

When creating an appointment, the backend:

1. **Fetches existing appointments** for the same barber
2. **Filters out cancelled** appointments
3. **Checks for time overlap** using this logic:
   ```
   Conflict exists if:
   newStart < existingEnd AND newEnd > existingStart
   ```
4. **Returns 409 Conflict** if overlap detected
5. **Creates appointment** if no conflict

**Example**:
```
Existing: 10:00 - 10:30
New:      10:15 - 10:45
Result:   CONFLICT (overlaps by 15 minutes)

Existing: 10:00 - 10:30
New:      10:30 - 11:00
Result:   SUCCESS (no overlap)
```

---

## Best Practices

### 1. Creating Appointments
Always:
- Calculate `end_time` from `start_time + total_duration`
- Include all service IDs and titles
- Set appropriate status (`pending` for new bookings)
- Handle 409 errors gracefully

### 2. Updating Appointments
When changing status to "completed":
- Update `payment_status` to "paid"
- The backend will automatically update customer's `total_spent`

### 3. Checking Availability
Before showing booking form:
- Fetch available slots for selected barber and date
- Only show slots that are returned by the API
- Refresh slots if date or barber changes

### 4. Real-time Updates
For production:
- Implement Supabase real-time subscriptions
- Listen for changes to appointments
- Update UI automatically when conflicts arise

---

## Example API Call (JavaScript)

```javascript
// Create an appointment
const response = await fetch(
  'https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0bdf1ecf/appointments',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ANON_KEY',
    },
    body: JSON.stringify({
      customer_name: 'Ahmed Ali',
      customer_phone: '+966 50 123 4567',
      barber_id: 'barber-id',
      barber_name: 'Mohammed',
      service_ids: ['service-1'],
      service_titles: ['Haircut'],
      start_time: '2026-03-15T10:00:00Z',
      end_time: '2026-03-15T10:30:00Z',
      total_duration: 30,
      total_price: 30,
      status: 'pending',
      payment_status: 'pending',
    }),
  }
);

if (response.status === 409) {
  alert('Time slot is already booked!');
} else if (response.ok) {
  const appointment = await response.json();
  console.log('Appointment created:', appointment);
}
```

---

## Testing the API

### Using cURL

```bash
# List barbers
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0bdf1ecf/barbers

# Create service
curl -X POST \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"Haircut","category":"barbering","price":30,"duration_minutes":30}' \
  https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0bdf1ecf/services
```

### Using Postman

1. Set `Authorization` header: `Bearer YOUR_ANON_KEY`
2. Set `Content-Type` header: `application/json`
3. Import the endpoints listed above
4. Test CRUD operations

---

## Rate Limiting

**Current**: No rate limiting (prototype)

**Production Recommendation**:
- Implement rate limiting (e.g., 100 requests/minute per IP)
- Use Supabase Edge Function middleware
- Return `429 Too Many Requests` when exceeded

---

## Support

For backend issues, check:
- `/supabase/functions/server/index.tsx` - Main API file
- Server logs in Supabase dashboard
- Ensure `Authorization` header is set correctly
