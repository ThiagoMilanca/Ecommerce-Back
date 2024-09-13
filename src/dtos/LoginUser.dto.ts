import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Length(8, 15, { message: 'Password must be between 8 and 15 characters' })
  @IsString()
  password: string;
}
