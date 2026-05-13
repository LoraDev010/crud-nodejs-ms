import { IsString, IsNumber, IsOptional, Min, MaxLength, IsObject } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsString()
  category!: string;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;
}
