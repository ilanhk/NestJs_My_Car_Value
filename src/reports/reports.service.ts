import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, model, longitude, latitude, year, mileage }: GetEstimateDto){
    return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price') //average price
      .where('make = :make' , { make }) //cars of a specific make
      .andWhere('model = :model' , { model }) //andWhere allows you to chain on from the first where statment
      .andWhere('longitude - :longitude BETWEEN -5 AND 5' , { longitude })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5' , { latitude })
      .andWhere('year - :year BETWEEN -3 AND 3' , { year })
      .andWhere('approved is TRUE') //only consider reports that have been approved
      .orderBy('ABS(mileage - :mileage)', 'DESC') //sort mileage in decending order, ABS(mileage - :mileage) -absolute value between the 2
      .setParameters({ mileage }) //orderBy cant add mileage as a parameter
      .limit(3) //make sure we only get the top 3 reports out of this query
      .getRawOne()
    // createQueryBuilder() -allows you to query data like sql (for complex queries)
    //if you need to call where more than once. the first one is where and the rest will be andWhere
    //'longitude - :longitude' -taking the longitude on the report and subtracting some other longitude from it.
    //BETWEEN -5 AND 5 want to make sure its either 5 or -5 degrees
    //.andWhere('year - :year BETWEEN -3 AND 3' , { year }) - this mean find the year plus or minus 3 years from it
  };
  
  create(reportDto: CreateReportDto, user: User){
    const report = this.repo.create(reportDto);
    report.user = user; //userId will be saved in the report
    return this.repo.save(report);
  };

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if(!report){
      throw new NotFoundException('report not found');
    };
    
    report.approved = approved;
    return this.repo.save(report);
  };

  


};
