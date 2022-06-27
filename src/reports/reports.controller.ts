import {
  UseGuards,
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/createReport.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/currentUser.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approveReport.dto';
import { AdminGuard } from '../guards/admin.guard';
import { getEstimateDto } from './dtos/getEstimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: getEstimateDto) {
    return this.reportService.createEstimate(query);
  }

  @Get('/:id')
  @Serialize(ReportDto)
  getReport(@Param('id') id: string) {
    return this.reportService.getReport(id);
  }
}
