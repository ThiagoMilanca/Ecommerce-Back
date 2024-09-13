import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/AuthGuard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dtos/CreateOrder.dto';
import { Order } from './orders.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'User or Product not found',
  })
  addOrder(@Body() order: CreateOrderDto) {
    return this.orderService.addOrder(order);
  }

  @ApiBearerAuth('JWT')
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: Order, // Assuming Order entity includes order details
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.getOrder(id);
  }
}
