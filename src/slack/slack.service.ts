import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private readonly webhookUrl: string = process.env.SLACK_WEBHOOK_URL;

  async sendMessage(text: string): Promise<void> {
    const payload = { text };

    try {
      await axios.post(this.webhookUrl, payload);
      this.logger.debug('슬랙으로 메시지 전송 완료');
    } catch (error) {
      this.logger.error('슬랙으로 메시지 전송 중 오류 발생', error.stack);
    }
  }
}
