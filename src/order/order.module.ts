import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [CartModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
