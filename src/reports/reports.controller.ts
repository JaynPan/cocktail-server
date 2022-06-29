import {
  UseGuards,
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Query,
  Get,
  Delete,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/createReport.dto';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/currentUser.decorator';
import { User } from '../users/models/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approveReport.dto';
import { AdminGuard } from '../users/guards/admin.guard';
import { getEstimateDto } from './dtos/getEstimate.dto';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/models/role.enum';
import { RolesGuard } from 'src/users/guards/role.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN) //only admin role can change approval
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteReport(@Param('id') reportId: string, @CurrentUser() user: User) {
    return this.reportService.delete(reportId, user.id);
  }
}
