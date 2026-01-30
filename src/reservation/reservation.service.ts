import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyService } from 'src/property/property.service';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private propertyService: PropertyService,
  ) {}
  async create(createReservationDto: CreateReservationDto) {
    const property = await this.propertyService.findOne(
      createReservationDto.propertyId,
    );
    const totalPrice =
      ((property?.price ?? 0) *
        (new Date(createReservationDto.endDate).getTime() -
          new Date(createReservationDto.startDate).getTime())) /
      (1000 * 60 * 60 * 24);
    return this.prisma.reservation.create({
      data: {
        ...createReservationDto,
        totalPrice,
        startDate: new Date(createReservationDto.startDate),
        endDate: new Date(createReservationDto.endDate),
        days: Math.ceil(
          (new Date(createReservationDto.endDate).getTime() -
            new Date(createReservationDto.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      },
    });
  }

  findAll() {
    return this.prisma.reservation.findMany({
      where: {
        enabled: true,
      },
      include: {
        property: true,
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.reservation.findUnique({
      where: { id, enabled: true },
      include: {
        property: true,
        user: true,
      },
    });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prisma.reservation.update({
      where: { id, enabled: true },
      data: updateReservationDto,
    });
  }

  remove(id: number) {
    return this.prisma.reservation.update({
      where: { id },
      data: { enabled: false },
    });
  }
}
