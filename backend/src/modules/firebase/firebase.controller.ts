import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SubscribeTopicDto } from './dto/subscribe-topic.dto';
import { FirebaseService } from './firebase.service';
import { SendTopicDto } from './dto/send-topic.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('subscribe')
  async subscribeTopic(
    @Body() subscribeTopicDto: SubscribeTopicDto,
  ): Promise<any> {
    try {
      await this.firebaseService.subscribeToTopic(subscribeTopicDto);

      return {
        message: 'Topic has been subscribed',
      };
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }

  @Post('send/topic')
  async sendToTopic(@Body() sendTopicDto: SendTopicDto): Promise<any> {
    try {
      await this.firebaseService.sendNotificationToTopic(sendTopicDto);

      return {
        message: 'Message has been sent.',
      };
    } catch (e) {
      const message: string = e.detail ?? e.message;
      throw new HttpException(message, HttpStatus.METHOD_NOT_ALLOWED);
    }
  }
}
