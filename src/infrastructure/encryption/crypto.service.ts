import crypto from 'crypto';
import { ENV } from '../../config/env.config';

export class CryptoService {
  private static ALGORITHM = 'aes-256-cbc';

  private static KEY: Buffer = (() => {
    if (!ENV.ENCRYPTION_KEY) {
      throw new Error('Missing ENCRYPTION_KEY in environment variables.');
    }
    return Buffer.from(ENV.ENCRYPTION_KEY, 'hex');
  })();

  private static IV = crypto.randomBytes(16);

  static encrypt(data: any): string {
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, this.IV);
    let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${this.IV.toString('hex')}:${encrypted}`;
  }
}
