import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PropertyModule } from 'src/property/property.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [PropertyModule],
})
export class ReservationModule {}
