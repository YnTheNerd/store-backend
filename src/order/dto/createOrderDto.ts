import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID de l’utilisateur qui passe la commande' })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 3, description: 'ID du panier associé à la commande' })
  @IsInt()
  @Min(1)
  cartId: number;
}
