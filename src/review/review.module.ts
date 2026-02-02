import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [UsersModule],
})
export class ReviewModule {}
