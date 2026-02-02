import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/common/exceptions/api-exception';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async create(createReviewDto: CreateReviewDto) {
    const findReservation = await this.prisma.reservation.findUnique({
      where: {
        id: createReviewDto.reservationId,
        userId: createReviewDto.userId,
        propertyId: createReviewDto.propertyId,
      },
    });
    if (!findReservation) {
      throw new ApiException(
        'Reservation not found or not authorized',
        404,
        'Not Found',
      );
    }
    const findReview = await this.prisma.review.findFirst({
      where: {
        reservationId: createReviewDto.reservationId,
      },
    });
    if (findReview) {
      throw new ApiException('Review already exists', 400, 'Bad Request');
    }
    return this.prisma.review.create({
      data: createReviewDto,
    });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: {
        property: true,
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        property: true,
        user: true,
      },
    });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }
}
