import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/cartDto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('add-product')
    addProduct(@Body() addProductDto: AddProductDto) {
        return this.cartService.addProduct(addProductDto);
    }

    @Delete('remove-item/:cartItemId')
    removeItem(@Param('cartItemId') cartItemId: number) {
        return this.cartService.removeItem(cartItemId);
    }

    @Get('total/:userId')
    getTotal(@Param('userId') userId: number) {
        return this.cartService.getTotal(userId);
    }

    @Delete('destruct/:userId')
    destructCart(@Param('userId') userId: number) {
        return this.cartService.destructCart(userId);
    }

    @Get(':userId')
    getCartById(@Param('id') id: string) {
        const userId = parseInt(id);
        return this.cartService.getCartById(userId);
    }
}
