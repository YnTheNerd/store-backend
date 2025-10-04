import { 
    Controller, 
    Post, 
    Param, 
    Body, 
    Delete, 
    Get, 
    ParseIntPipe, 
    Query
  } from '@nestjs/common';
  import { OrderService } from './order.service';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/createOrderDto';
  
  @Controller('orders')
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get("all")
        getUsers(
            @Query('page') page: string,
            @Query('limit') limit: string
        ) {
            const pageNumber = parseInt(page) || 1;
            const limitNumber = parseInt(limit) || 10;
            return this.orderService.getOrders(pageNumber, limitNumber);
        }
    

    @Post('place')
    async placeOrder(@Body()createOrderDto: CreateOrderDto) {
      return this.orderService.placeOrder(createOrderDto);
    }
  
  
    @Delete(':orderId/cancel')
    async cancelOrder(@Param('orderId', ParseIntPipe) orderId: number) {
      return this.orderService.cancelOrder(orderId);
    }
  
    @Get(':orderId/track')
    async trackOrder(
      @Param('orderId', ParseIntPipe) orderId: number,
      @Body('status') status: string,   
    ) {
      return this.orderService.trackOrder(orderId, status ?? 'EN_COURS');
    }
  }
  