import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../../dtos/products.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../users/roles/roles.guard';
import { Product } from './product.entity';
import { Roles } from 'src/modules/users/roles/roles.decorator';
import { Role } from 'src/modules/users/roles/roles.enum';

@ApiTags('Products')
@ApiBearerAuth('JWT')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'products retrieved successfully :)',
  })
  @ApiResponse({ status: 404, description: 'products not found :(' })
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by id' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully :)',
  })
  @ApiResponse({
    status: 401,
    description: 'You do not have authorization for this route :|',
  })
  @ApiResponse({ status: 404, description: 'Product not found :(' })
  getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }

  @Post('new')
  @ApiOperation({ summary: 'Created a new product' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      example: {
        summary: 'Example of registering a new user',
        value: {
          name: 'Sample Product',
          description: 'A detailed description of the sample product',
          price: 59.99,
          stock: true,
          imgUrl:
            'https://www.lavoz.com.ar/resizer/OzFzmC8SrRNJzSGCXj3aJgDGO3k=/0x0:0x0/980x640/filters:quality(80):format(webp)/cloudfront-us-east-1.images.arcpublishing.com/grupoclarin/BGRXLQMBXNADBIBSMZ6VQUUNQI.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'product created successfully :)',
  })
  @ApiResponse({ status: 400, description: 'The format used is incorrect :(' })
  @ApiResponse({ status: 404, description: 'product not created :(' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  addProduct() {
    return this.productsService.addProduct();
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Modify a product by id' })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      example: {
        summary: 'Example of changing a product name',
        value: {
          name: 'new name',
        },
      },
      example1: {
        summary: 'Example of changing a product description',
        value: {
          description: 'new description',
        },
      },
      example2: {
        summary: 'Example of changing a product price',
        value: {
          price: 39.99,
        },
      },
      example3: {
        summary: 'Example of changing a product stock',
        value: {
          stock: false,
        },
      },
      example4: {
        summary: 'Example of changing a product imgUrl',
        value: {
          imgUrl: 'new imgUrl',
        },
      },
      example5: {
        summary: 'Example of changing everything',
        value: {
          name: 'new name',
          description: 'new description',
          price: 39.99,
          stock: false,
          imgUrl: 'new imgUrl',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product modified successfully :)',
  })
  @ApiResponse({ status: 400, description: 'The format used is incorrect :(' })
  @ApiResponse({
    status: 401,
    description: 'You do not have authorization for this route :|',
  })
  @ApiResponse({ status: 404, description: 'Product not modified :(' })
  updateProduct(@Param('id') id: string, @Body() updateProductDto: Product) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully :)',
  })
  @ApiResponse({
    status: 401,
    description: 'You do not have authorization for this route :|',
  })
  @ApiResponse({ status: 404, description: 'Product not deleted :(' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
