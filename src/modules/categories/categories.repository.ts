import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../categories/categories.entity';
import { Repository } from 'typeorm';
import * as data from '../../data.json';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories() {
    return this.categoriesRepository.find();
  }

  async addCategories() {
    await Promise.all(
      data?.map(async (element) => {
        await this.categoriesRepository
          .createQueryBuilder()
          .insert()
          .into(Categories)
          .values({ name: element.category })
          .orIgnore()
          .execute();
      }),
    );
    return 'Categorías Agregadas';
  }
}
