import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  /*  @IsString()
  @IsNotEmpty()
  id: string; */

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  orderDetailId?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  stock?: boolean;

  @IsString()
  @IsOptional()
  imgUrl?: string;
}

export class PartialProductDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
  stock: boolean;
}
