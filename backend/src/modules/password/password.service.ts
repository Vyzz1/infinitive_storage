import { Injectable } from '@nestjs/common';
import Iron from '@hapi/iron';
@Injectable()
export class PasswordService {
  private readonly encryptKey: string = process.env.SECRET_ENCRYPT_KEY || '';

  async encryptSecret(secret: string): Promise<string> {
    return await Iron.seal(secret, this.encryptKey, Iron.defaults);
  }

  async decryptSecret(encryptedSecret: string): Promise<string> {
    return await Iron.unseal(encryptedSecret, this.encryptKey, Iron.defaults);
  }
}
