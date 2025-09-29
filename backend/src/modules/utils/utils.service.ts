import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  async hashTextData(textData: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedText = await bcrypt.hash(textData, salt);
    return hashedText;
  }

  async compareHashedText(
    textData: string,
    hashedTextData: string,
  ): Promise<boolean> {
    return await bcrypt.compare(textData, hashedTextData);
  }
}
