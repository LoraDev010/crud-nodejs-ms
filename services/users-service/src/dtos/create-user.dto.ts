import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';
import { UserRole } from '@crud-ms/shared';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsIn(['admin', 'user'] satisfies UserRole[])
  role?: UserRole;
}
