import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../orders/orders.repository';
import { CreateOrderDto } from 'src/dtos/CreateOrder.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrderRepository) {}

  addOrder(order: CreateOrderDto) {
    return this.ordersRepository.addOrder(order);
  }

  getOrder(id: string) {
    return this.ordersRepository.getOrder(id);
  }
}
