import { 
  IsNumber, 
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,

} from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDto {
  
  @IsString()
  make: string;

  @IsString()
  model: string;

  
  @Transform(({ value })=> parseInt(value)) //value will be the year in the string form
  @IsNumber()
  @Min(1930) //min year
  @Max(2050) //max year
  year: number;

  @Transform(({ value })=> parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(10000000)
  mileage: number;

  @Transform(({ value })=> parseFloat(value))
  @IsLongitude()
  longitude: number;

  @Transform(({ value })=> parseFloat(value))
  @IsLatitude()
  latitude: number;

};