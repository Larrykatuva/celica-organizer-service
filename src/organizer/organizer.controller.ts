import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../shared/decorators/response.decorators';
import {
  CreateOrganizerDto,
  OrganizerResponseDto,
  UpdateOrganizerDto,
} from './organizer.dtos';
import { Organizer } from './organizer.entity';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../shared/decorators/query.decorators';
import { DefaultPagination } from '../shared/interfaces/pagination.interface';
import { RpcAuthGuard } from '../shared/guards/transport.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransportAction } from '../shared/interfaces/shared.interface';

@ApiTags('ORGANIZER')
@Controller('organizer')
export class OrganizerController {
  constructor(private organizerService: OrganizerService) {}

  @UseGuards(RpcAuthGuard)
  @MessagePattern('celica_organizer')
  async handleOrganizerEvent(
    @Payload() data: TransportAction<any>,
  ): Promise<void> {
    await this.organizerService.transportAction(data);
  }

  @Post()
  @SharedResponse(OrganizerResponseDto)
  async registerOrganizer(
    @Body() organizer: CreateOrganizerDto,
  ): Promise<Organizer> {
    return await this.organizerService.createOrganizer(organizer);
  }

  @Get()
  @SharedPaginatedResponse(OrganizerResponseDto)
  async listOrganizers(
    @ExtractRequestPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[Organizer[], number]> {
    return await this.organizerService.filterOrganizers(pagination, query);
  }

  @Get(':sub')
  @SharedResponse(OrganizerResponseDto)
  async getOrganizer(@Param('sub') sub: string): Promise<Organizer> {
    return await this.organizerService.filterOrganizer({ sub: sub });
  }

  @Patch(':sub')
  @SharedResponse(OrganizerResponseDto)
  async updateOrganizer(
    @Param('sub') sub: string,
    @Body() data: UpdateOrganizerDto,
  ): Promise<Organizer> {
    return await this.organizerService.updateOrganizer({
      sub: sub,
      updateData: data,
    });
  }
}
