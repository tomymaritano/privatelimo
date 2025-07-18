import { Client, DistanceMatrixResponse, DirectionsResponse } from '@googlemaps/google-maps-services-js';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  distanceText: string;
  durationText: string;
  polyline?: string;
}

export class MapsService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Google Maps API key not configured');
    }
  }

  async calculateRoute(
    origin: LocationCoordinates,
    destination: LocationCoordinates
  ): Promise<RouteInfo> {
    try {
      if (!this.apiKey) {
        // Fallback calculation using Haversine formula
        return this.calculateRouteFallback(origin, destination);
      }

      const response = await this.client.distancematrix({
        params: {
          origins: [`${origin.lat},${origin.lng}`],
          destinations: [`${destination.lat},${destination.lng}`],
          mode: 'driving' as any,
          units: 'metric' as any,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK' || !response.data.rows[0]) {
        throw new Error('Error calculating route');
      }

      const element = response.data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        throw new Error('No route found');
      }

      return {
        distance: element.distance.value,
        duration: element.duration.value,
        distanceText: element.distance.text,
        durationText: element.duration.text,
      };
    } catch (error) {
      console.error('Google Maps API error:', error);
      // Fallback to approximate calculation
      return this.calculateRouteFallback(origin, destination);
    }
  }

  async getDirections(
    origin: LocationCoordinates,
    destination: LocationCoordinates
  ): Promise<RouteInfo & { polyline: string }> {
    try {
      if (!this.apiKey) {
        const fallback = this.calculateRouteFallback(origin, destination);
        return { ...fallback, polyline: '' };
      }

      const response = await this.client.directions({
        params: {
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode: 'driving' as any,
          units: 'metric' as any,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK' || !response.data.routes[0]) {
        throw new Error('Error getting directions');
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance.value,
        duration: leg.duration.value,
        distanceText: leg.distance.text,
        durationText: leg.duration.text,
        polyline: route.overview_polyline.points,
      };
    } catch (error) {
      console.error('Google Directions API error:', error);
      const fallback = this.calculateRouteFallback(origin, destination);
      return { ...fallback, polyline: '' };
    }
  }

  async geocodeAddress(address: string): Promise<LocationCoordinates | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK' || !response.data.results[0]) {
        return null;
      }

      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async reverseGeocode(coordinates: LocationCoordinates): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const response = await this.client.reverseGeocode({
        params: {
          latlng: `${coordinates.lat},${coordinates.lng}`,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK' || !response.data.results[0]) {
        return null;
      }

      return response.data.results[0].formatted_address;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Fallback calculation using Haversine formula
  private calculateRouteFallback(
    origin: LocationCoordinates,
    destination: LocationCoordinates
  ): RouteInfo {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(destination.lat - origin.lat);
    const dLon = this.toRad(destination.lng - origin.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(origin.lat)) * Math.cos(this.toRad(destination.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    // Apply a factor for road distance (typically 1.3-1.5x straight line)
    const roadDistance = distance * 1.4;
    const distanceMeters = Math.round(roadDistance * 1000);
    
    // Estimate duration based on average speed of 40 km/h in city
    const averageSpeed = 40;
    const durationHours = roadDistance / averageSpeed;
    const durationSeconds = Math.round(durationHours * 3600);
    
    return {
      distance: distanceMeters,
      duration: durationSeconds,
      distanceText: `${roadDistance.toFixed(1)} km`,
      durationText: `${Math.round(durationSeconds / 60)} mins`,
    };
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  // Check if a point is inside a polygon
  isPointInPolygon(point: LocationCoordinates, polygon: LocationCoordinates[]): boolean {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;
      
      const intersect = ((yi > point.lat) !== (yj > point.lat))
        && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  }
}