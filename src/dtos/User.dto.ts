import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
//import { IsEmailUnique } from 'src/validators/email.validator';
import { IsPasswordValid } from 'src/validators/password.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  @Length(3, 80)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  //@IsEmailUnique()
  readonly email: string;

  @IsPasswordValid()
  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  readonly address: string;

  @IsNotEmpty()
  readonly phone: number;

  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  readonly country: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly role: string;

  @IsString()
  readonly order?: [];
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: number;
  country?: string;
  city?: string;
  order: [];
}
