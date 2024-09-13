import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesServices: CategoriesService) {}

  @Get('seeder')
  addCategories() {
    return this.categoriesServices.addCategories();
  }

  @Get()
  getCategories() {
    return this.categoriesServices.getCategories();
  }
}
