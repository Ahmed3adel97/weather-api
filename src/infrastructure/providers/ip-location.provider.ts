import axios from 'axios';

export class IpLocationProvider {
  private API_URL = 'https://ipwho.is';

  async getLocation(
    ip: string
  ): Promise<{ lat: number; lon: number; city: string; country: string }> {
    try {
      const response = await axios.get(`${this.API_URL}/${ip}`);
      const data = response.data;

      if (!data.success) {
        throw new Error('Failed to retrieve location from IP.');
      }

      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city,
        country: data.country_code,
      };
    } catch (error: any) {
      throw new Error('Could not retrieve location from IP.');
    }
  }
}
