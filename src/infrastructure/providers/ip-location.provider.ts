import axios from 'axios';
import { ENV } from '../../config/env.config';

export class IpLocationProvider {
  private API_URL = 'http://ip-api.com/json';

  async getLocation(
    ip: string
  ): Promise<{ lat: number; lon: number; city: string; country: string }> {
    const response = await axios.get(`${this.API_URL}/${ip}`);
    const data = response.data;
    if (data.status !== 'success') {
      throw new Error('Failed to retrieve location from IP.');
    }
    return {
      lat: data.lat,
      lon: data.lon,
      city: data.city,
      country: data.countryCode,
    };
  }
}
