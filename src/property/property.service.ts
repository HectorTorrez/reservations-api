import { Injectable } from '@nestjs/common';
import { Property } from '@prisma/client';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyMapper } from './mappers/property.mapper';
import { PropertyFilterDto } from './dto/filters.dto';
import {
  PaginationService,
  PaginationDelegate,
} from 'src/common/pagination/pagination.service';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const response = await this.prisma.property.create({
      data: createPropertyDto,
    });
    return PropertyMapper.toResponse(response);
  }

  async findAll(query: PropertyFilterDto) {
    return this.paginationService.paginateFromFilter(query, {
      delegate: this.prisma.property as PaginationDelegate<Property>,
      buildWhere: (q) => ({
        enabled: true,
        price: {
          gte: q.minPrice ? Number(q.minPrice) : undefined,
          lte: q.maxPrice ? Number(q.maxPrice) : undefined,
        },
      }),
      map: (items) => PropertyMapper.toResponseList(items),
    });
  }

  async findOne(id: number) {
    const response = await this.prisma.property.findUnique({
      where: { id },
    });
    return response ? PropertyMapper.toResponse(response) : response;
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return this.prisma.property.update({
      where: { id },
      data: updatePropertyDto,
    });
  }

  remove(id: number) {
    return this.prisma.property.update({
      where: { id },
      data: { enabled: false },
    });
  }
}
