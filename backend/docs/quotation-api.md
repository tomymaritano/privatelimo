# Quotation System API Documentation

## Overview
The quotation system provides automatic pricing calculations for PrivateLimo services, including dynamic pricing, zone surcharges, and time-based adjustments.

## Endpoints

### Public Endpoints

#### Get Available Services
```
GET /api/quotations/services
```
Returns all active services with their base pricing information.

#### Quick Quote (No Authentication Required)
```
GET /api/quotations/quick-quote
```
Query parameters:
- `serviceId` (required): UUID of the service
- `pickupLat` (required): Pickup latitude
- `pickupLng` (required): Pickup longitude
- `dropoffLat` (required): Dropoff latitude
- `dropoffLng` (required): Dropoff longitude

Returns immediate price calculation without creating a quotation record.

#### Estimate Price Range
```
GET /api/quotations/estimate
```
Query parameters:
- `serviceId` (required): UUID of the service
- `distanceKm` (required): Estimated distance in kilometers

Returns a price range estimate based on distance.

#### Get Quotation Details
```
GET /api/quotations/:quotationId
```
Returns details of a specific quotation including expiration status.

#### Get WhatsApp Message
```
GET /api/quotations/:quotationId/whatsapp
```
Returns a formatted WhatsApp message for the quotation.

### Authenticated Endpoints

#### Create Quotation
```
POST /api/quotations
```
Request body:
```json
{
  "serviceId": "uuid",
  "pickupAddress": "string",
  "pickupLat": -34.603722,
  "pickupLng": -58.381592,
  "dropoffAddress": "string",
  "dropoffLat": -34.603722,
  "dropoffLng": -58.381592,
  "requestedDate": "2024-12-25T10:00:00Z",
  "passengerCount": 2,
  "specialRequirements": "string (optional)"
}
```

Creates a quotation valid for 30 minutes.

#### Get User Quotations
```
GET /api/quotations/user/quotations
```
Query parameters:
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

Returns paginated list of user's quotations.

#### Accept Quotation
```
POST /api/quotations/:quotationId/accept
```
Accepts a quotation (first step before creating a booking).

## Zone System Endpoints

### Public Zone Endpoints

#### Get Active Zones GeoJSON
```
GET /api/zones/geojson
```
Returns all active zones in GeoJSON format for map display.

#### Check Point in Zone
```
GET /api/zones/check-point
```
Query parameters:
- `lat` (required): Latitude
- `lng` (required): Longitude

Checks if a coordinate is within any active zone.

#### Get Zone Surcharge
```
GET /api/zones/surcharge
```
Query parameters:
- `lat` (required): Latitude
- `lng` (required): Longitude

Returns surcharge information for a specific coordinate.

### Admin Zone Endpoints (Requires Admin Role)

#### Create Zone
```
POST /api/zones
```
Request body:
```json
{
  "name": "Aeropuerto Ezeiza",
  "slug": "aeropuerto-ezeiza",
  "polygon": [
    {"lat": -34.8222, "lng": -58.5358},
    {"lat": -34.8222, "lng": -58.5158},
    {"lat": -34.8022, "lng": -58.5158},
    {"lat": -34.8022, "lng": -58.5358}
  ],
  "surchargePercentage": 15,
  "surchargeFixed": 800,
  "isActive": true
}
```

#### Update Zone
```
PUT /api/zones/:zoneId
```
Updates zone information.

#### Delete Zone
```
DELETE /api/zones/:zoneId
```
Soft deletes a zone (sets isActive to false).

## Pricing Calculation

The system calculates prices based on:

1. **Base Components**:
   - Base price
   - Distance price (per km)
   - Time price (per minute)

2. **Dynamic Adjustments**:
   - Surge pricing (time-based multipliers)
   - Zone surcharges (percentage and fixed)
   - Night surcharges

3. **Price Breakdown**:
   Each quotation includes a detailed breakdown of all price components for transparency.

## Example Usage

### Creating a Quotation
```bash
curl -X POST http://localhost:3001/api/quotations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "123e4567-e89b-12d3-a456-426614174000",
    "pickupAddress": "Av. Corrientes 1234, CABA",
    "pickupLat": -34.603722,
    "pickupLng": -58.381592,
    "dropoffAddress": "Aeropuerto Ezeiza",
    "dropoffLat": -34.8222,
    "dropoffLng": -58.5358,
    "requestedDate": "2024-12-25T15:00:00Z",
    "passengerCount": 2
  }'
```

### Getting a Quick Quote
```bash
curl "http://localhost:3001/api/quotations/quick-quote?serviceId=123e4567-e89b-12d3-a456-426614174000&pickupLat=-34.603722&pickupLng=-58.381592&dropoffLat=-34.8222&dropoffLng=-58.5358"
```

## Notes

- Quotations expire after 30 minutes
- Prices are returned in ARS (Argentine Pesos)
- All coordinates should use decimal degrees format
- Zone surcharges are cumulative if pickup/dropoff are in different zones
- The system falls back to Haversine formula if Google Maps API is unavailable