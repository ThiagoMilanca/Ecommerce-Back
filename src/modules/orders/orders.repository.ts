import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from 'src/dtos/CreateOrder.dto';
import { Product } from '../products/product.entity';
import { OrderDetails } from '../ordersDetails/ordersDetails.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async addOrder(orders: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;

      const user = await queryRunner.manager.findOne(User, {
        where: { id: orders.userId },
      });
      if (!user)
        throw new NotFoundException(
          `Usuario con id ${orders.userId} inexistente`,
        );

      const order = new Order();
      order.date = new Date();
      order.user = user;
      const newOrder = await queryRunner.manager.save(order);

      const productsArray: Product[] = await Promise.all(
        orders.products.map(async (element) => {
          const product = await queryRunner.manager.findOne(Product, {
            where: { id: element.id },
          });
          if (!product)
            throw new NotFoundException(
              `Producto con id ${element.id} inexistente`,
            );

          total += Number(product.price);

          const stock = product.stock;
          if (stock === 0) {
            throw new NotFoundException('Stock insuficiente');
          }

          await queryRunner.manager.update(
            Product,
            { id: element.id },
            { stock: product.stock - 1 },
          );

          return product;
        }),
      );

      const orderDetails = new OrderDetails();
      orderDetails.price = Number(Number(total).toFixed(2));
      orderDetails.products = productsArray;
      orderDetails.order = newOrder;
      console.log('NUEVA ORDEN', orderDetails);

      await queryRunner.manager.save(orderDetails);

      await queryRunner.commitTransaction();

      return await this.orderRepository.find({
        where: { id: order.id },
        relations: {
          orderDetails: true,
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { orderDetails: true },
    });
    if (!order) {
      throw new NotFoundException('Order does not exist');
    }
    return order;
  }
}
