import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyMapper } from './mappers/property.mapper';
@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const response = await this.prisma.property.create({
      data: createPropertyDto,
    });
    return PropertyMapper.toResponse(response);
  }

  findAll() {
    return this.prisma.property.findMany({
      where: { enabled: true },
    });
  }

  findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
    });
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
