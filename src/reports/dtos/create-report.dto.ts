import { 
  IsNumber, 
  IsString,
  Min,
  Max,
  IsLongitude,
  IsLatitude,

} from "class-validator";

export class CreateReportDto {
  
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930) //min year
  @Max(2050) //max year
  year: number;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  mileage: number;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

};