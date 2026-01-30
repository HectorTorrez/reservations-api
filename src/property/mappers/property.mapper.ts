import { Property } from '@prisma/client';
import { PropertyResponseDto } from '../dto/property.response.dto';

export class PropertyMapper {
  static toResponse(property: Property): PropertyResponseDto {
    return {
      id: property.id,
      title: property.title,
      enabled: property.enabled,
      price: property.price,
    };
  }

  static toResponseList(properties: Property[]): PropertyResponseDto[] {
    return properties.map((property) => this.toResponse(property));
  }
}
