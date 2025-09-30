import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SubscribeTopicDto } from './dto/subscribe-topic.dto';
import { SendTopicDto } from './dto/send-topic.dto';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebase: typeof admin,
  ) {}

  async subscribeToTopic(subscribeTopicDto: SubscribeTopicDto) {
    return this.firebase
      .messaging()
      .subscribeToTopic(subscribeTopicDto.token, subscribeTopicDto.topic);
  }

  async sendNotificationToTopic(sendTopicDto: SendTopicDto) {
    return this.firebase.messaging().send({
      notification: {
        title: sendTopicDto.title,
        body: sendTopicDto.body,
      },
      topic: sendTopicDto.topic,
    });
  }

  async verifyIdToken(idToken: string) {
    return this.firebase.auth().verifyIdToken(idToken);
  }
}
