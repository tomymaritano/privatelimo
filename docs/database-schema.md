# Esquema de Base de Datos - PrivateLimo

## Tablas Principales

### 1. Users (Usuarios)
```sql
- id: UUID (PK)
- email: String (unique, indexed)
- phone: String (unique, indexed)
- password_hash: String
- role: Enum (client, driver, admin)
- status: Enum (active, inactive, suspended)
- created_at: Timestamp
- updated_at: Timestamp
- deleted_at: Timestamp (soft delete)
```

### 2. Profiles (Perfiles)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- first_name: String
- last_name: String
- document_type: Enum (dni, passport, license)
- document_number: String
- birth_date: Date
- address: String
- city: String
- state: String
- country: String
- zip_code: String
- profile_image_url: String
- emergency_contact_name: String
- emergency_contact_phone: String
- created_at: Timestamp
- updated_at: Timestamp
```

### 3. Drivers (Conductores)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- license_number: String (unique)
- license_expiry: Date
- license_image_url: String
- background_check_status: Enum (pending, approved, rejected)
- background_check_date: Date
- rating: Decimal (1-5)
- total_trips: Integer
- status: Enum (available, busy, offline)
- current_location_lat: Decimal
- current_location_lng: Decimal
- last_location_update: Timestamp
- bank_account_info: JSON (encrypted)
- commission_rate: Decimal (porcentaje)
- created_at: Timestamp
- updated_at: Timestamp
```

### 4. Vehicles (Vehículos)
```sql
- id: UUID (PK)
- driver_id: UUID (FK -> Drivers, nullable)
- brand: String
- model: String
- year: Integer
- license_plate: String (unique)
- color: String
- category: Enum (sedan, suv, van, luxury)
- capacity_passengers: Integer
- capacity_luggage: Integer
- features: JSON (wifi, ac, charger, etc)
- insurance_policy_number: String
- insurance_expiry: Date
- inspection_date: Date
- inspection_expiry: Date
- status: Enum (active, maintenance, inactive)
- images: JSON (array of URLs)
- created_at: Timestamp
- updated_at: Timestamp
```

### 5. Services (Servicios)
```sql
- id: UUID (PK)
- name: String
- slug: String (unique)
- description: Text
- base_price: Decimal
- price_per_km: Decimal
- price_per_minute: Decimal
- minimum_distance_km: Decimal
- minimum_duration_minutes: Integer
- max_passengers: Integer
- vehicle_categories: JSON (array of categories)
- is_active: Boolean
- created_at: Timestamp
- updated_at: Timestamp
```

### 6. Pricing_Rules (Reglas de Precio)
```sql
- id: UUID (PK)
- service_id: UUID (FK -> Services)
- rule_type: Enum (surge, discount, time_based, zone_based)
- name: String
- conditions: JSON (hora, zona, demanda, etc)
- multiplier: Decimal
- fixed_amount: Decimal
- start_date: Date
- end_date: Date
- is_active: Boolean
- priority: Integer
- created_at: Timestamp
- updated_at: Timestamp
```

### 7. Quotations (Cotizaciones)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users, nullable)
- service_id: UUID (FK -> Services)
- pickup_address: String
- pickup_lat: Decimal
- pickup_lng: Decimal
- dropoff_address: String
- dropoff_lat: Decimal
- dropoff_lng: Decimal
- distance_km: Decimal
- duration_minutes: Integer
- base_price: Decimal
- distance_price: Decimal
- time_price: Decimal
- surge_price: Decimal
- discounts: Decimal
- total_price: Decimal
- price_breakdown: JSON
- requested_date: Timestamp
- passenger_count: Integer
- special_requirements: Text
- status: Enum (pending, accepted, expired)
- expires_at: Timestamp
- created_at: Timestamp
```

### 8. Bookings (Reservas)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- driver_id: UUID (FK -> Drivers, nullable)
- vehicle_id: UUID (FK -> Vehicles, nullable)
- service_id: UUID (FK -> Services)
- quotation_id: UUID (FK -> Quotations, nullable)
- booking_code: String (unique, 6 chars)
- pickup_address: String
- pickup_lat: Decimal
- pickup_lng: Decimal
- dropoff_address: String
- dropoff_lat: Decimal
- dropoff_lng: Decimal
- scheduled_pickup_time: Timestamp
- actual_pickup_time: Timestamp
- estimated_arrival_time: Timestamp
- actual_arrival_time: Timestamp
- distance_km: Decimal
- duration_minutes: Integer
- base_price: Decimal
- final_price: Decimal
- surge_multiplier: Decimal
- payment_method: Enum (cash, card, transfer)
- payment_status: Enum (pending, processing, completed, failed, refunded)
- status: Enum (pending, confirmed, driver_assigned, driver_arrived, in_progress, completed, cancelled)
- cancellation_reason: String
- cancelled_by: Enum (client, driver, admin, system)
- rating_driver: Integer (1-5)
- rating_client: Integer (1-5)
- driver_notes: Text
- client_notes: Text
- created_at: Timestamp
- updated_at: Timestamp
```

### 9. Payments (Pagos)
```sql
- id: UUID (PK)
- booking_id: UUID (FK -> Bookings)
- user_id: UUID (FK -> Users)
- amount: Decimal
- currency: String (USD, ARS, etc)
- payment_method: Enum (mercadopago, stripe, cash, transfer)
- gateway_payment_id: String (ID del gateway)
- gateway_response: JSON
- status: Enum (pending, processing, completed, failed, refunded)
- processed_at: Timestamp
- refund_amount: Decimal
- refund_reason: String
- refunded_at: Timestamp
- created_at: Timestamp
- updated_at: Timestamp
```

### 10. Driver_Earnings (Ganancias de Conductores)
```sql
- id: UUID (PK)
- driver_id: UUID (FK -> Drivers)
- booking_id: UUID (FK -> Bookings)
- gross_amount: Decimal
- commission_rate: Decimal
- commission_amount: Decimal
- net_amount: Decimal
- tips: Decimal
- bonuses: Decimal
- deductions: Decimal
- final_amount: Decimal
- payment_status: Enum (pending, paid)
- payment_date: Date
- payment_reference: String
- created_at: Timestamp
```

### 11. Notifications (Notificaciones)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- type: Enum (booking_confirmed, driver_assigned, driver_arrived, trip_completed, payment_received)
- channel: Enum (email, sms, whatsapp, push)
- title: String
- message: Text
- data: JSON (datos adicionales)
- status: Enum (pending, sent, failed)
- sent_at: Timestamp
- read_at: Timestamp
- created_at: Timestamp
```

### 12. Tracking_History (Historial de Tracking)
```sql
- id: UUID (PK)
- booking_id: UUID (FK -> Bookings)
- driver_id: UUID (FK -> Drivers)
- lat: Decimal
- lng: Decimal
- speed_kmh: Decimal
- heading: Integer (0-360)
- accuracy_meters: Decimal
- recorded_at: Timestamp
```

### 13. Reviews (Reseñas)
```sql
- id: UUID (PK)
- booking_id: UUID (FK -> Bookings)
- reviewer_id: UUID (FK -> Users)
- reviewed_id: UUID (FK -> Users)
- rating: Integer (1-5)
- comment: Text
- is_public: Boolean
- created_at: Timestamp
- updated_at: Timestamp
```

### 14. Zones (Zonas)
```sql
- id: UUID (PK)
- name: String
- slug: String (unique)
- polygon: JSON (GeoJSON)
- surcharge_percentage: Decimal
- surcharge_fixed: Decimal
- is_active: Boolean
- created_at: Timestamp
- updated_at: Timestamp
```

### 15. Promocodes (Códigos Promocionales)
```sql
- id: UUID (PK)
- code: String (unique)
- description: String
- discount_type: Enum (percentage, fixed)
- discount_value: Decimal
- minimum_amount: Decimal
- maximum_discount: Decimal
- usage_limit: Integer
- usage_count: Integer
- user_limit_per_code: Integer
- valid_from: Timestamp
- valid_until: Timestamp
- service_ids: JSON (servicios aplicables)
- is_active: Boolean
- created_at: Timestamp
- updated_at: Timestamp
```

### 16. User_Promocodes (Uso de Promocodes)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- promocode_id: UUID (FK -> Promocodes)
- booking_id: UUID (FK -> Bookings)
- discount_applied: Decimal
- used_at: Timestamp
```

### 17. Company_Accounts (Cuentas Corporativas)
```sql
- id: UUID (PK)
- name: String
- tax_id: String
- billing_address: Text
- billing_email: String
- credit_limit: Decimal
- current_balance: Decimal
- payment_terms_days: Integer
- discount_percentage: Decimal
- status: Enum (active, suspended, closed)
- created_at: Timestamp
- updated_at: Timestamp
```

### 18. Company_Users (Usuarios Corporativos)
```sql
- id: UUID (PK)
- company_id: UUID (FK -> Company_Accounts)
- user_id: UUID (FK -> Users)
- is_admin: Boolean
- spending_limit: Decimal
- created_at: Timestamp
```

### 19. Audit_Logs (Logs de Auditoría)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- action: String
- entity_type: String
- entity_id: UUID
- old_values: JSON
- new_values: JSON
- ip_address: String
- user_agent: String
- created_at: Timestamp
```

### 20. Settings (Configuraciones)
```sql
- id: UUID (PK)
- key: String (unique)
- value: JSON
- description: String
- updated_by: UUID (FK -> Users)
- updated_at: Timestamp
```

## Índices Recomendados

1. Users: email, phone, role
2. Bookings: user_id, driver_id, status, scheduled_pickup_time
3. Payments: booking_id, status, gateway_payment_id
4. Drivers: status, current_location (spatial index)
5. Vehicles: status, category
6. Tracking_History: booking_id, recorded_at

## Relaciones Clave

- Un Usuario puede ser Cliente o Conductor
- Un Conductor puede tener múltiples Vehículos
- Una Reserva conecta Cliente, Conductor y Vehículo
- Los Pagos están vinculados a Reservas
- Las Cotizaciones pueden convertirse en Reservas
- El Tracking registra la ubicación durante el viaje