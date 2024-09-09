import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards,
  Patch,
  Param,
  Query, 
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard'; //make sure user in signed in 
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService){};

  @Get()
  getEstimate(@Query() query: GetEstimateDto){
    return this.reportsService.createEstimate(query);
  };

  @Post()
  @UseGuards(AuthGuard) //make sure user is signed in before using this route
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User){
    return this.reportsService.create(body, user);
  };


  @Patch('/:id')
  @UseGuards(AdminGuard) //only users with admin status can access this route
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
    return this.reportsService.changeApproval(id, body.approved);
  };
};
