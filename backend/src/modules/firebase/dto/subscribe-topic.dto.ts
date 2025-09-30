import { IsNotEmpty, IsString } from 'class-validator';

export class SubscribeTopicDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  topic: string;
}
