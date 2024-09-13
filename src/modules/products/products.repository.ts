import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as data from '../../data.json';
import { Categories } from '../categories/categories.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product || !product.stock) {
      throw new NotFoundException(`Product does not exist or out of stock`);
    }
    return product;
  }

  async addProduct() {
    const categories = await this.categoriesRepository.find({
      relations: {
        products: true,
      },
    });

    for (const element of data) {
      const category = categories.find(
        (category) => category.name === element.category,
      );

      if (!category) {
        console.error(`Category not found: ${element.category}`);
        continue;
      }

      const product = new Product();
      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.imgUrl = element.imgUrl;
      product.stock = element.stock;
      product.category = category;

      await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(product)
        .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
        .execute();
    }

    return 'Productos agregados';
  }

  async updateProduct(id: string, product: Product) {
    await this.productRepository.update(id, product);
    const updateProduct = await this.productRepository.findOneBy({ id });
    return updateProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.delete(id);
  }
}
