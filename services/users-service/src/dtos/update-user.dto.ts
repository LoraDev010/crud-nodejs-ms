import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { UserRole } from '@crud-ms/shared';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsIn(['admin', 'user'] satisfies UserRole[])
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
