import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProducts(): Promise<Product[]> {
    return this.productsRepository.getProducts();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productsRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async addProduct(): Promise<string> {
    try {
      await this.productsRepository.addProduct();

      return 'New product added successfully';
    } catch (error) {
      throw new Error('Error adding new product');
    }
  }

  async updateProduct(id: string, product: Product) {
    return this.productsRepository.updateProduct(id, product);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const product = await this.productsRepository.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productsRepository.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}
