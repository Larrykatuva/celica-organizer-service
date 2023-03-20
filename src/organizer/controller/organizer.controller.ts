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
import { OrganizerService } from '../services/organizer.service';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../../shared/decorators/response.decorators';
import {
  CreateOrganizerDto,
  OrganizerResponseDto,
  UpdateOrganizerDto,
} from '../dtos/organizer.dtos';
import { Organizer } from '../entity/organizer.entity';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../../shared/decorators/query.decorators';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { RpcAuthGuard } from '../../shared/guards/transport.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  TransportAction,
  UserInfoResponse,
} from '../../shared/interfaces/shared.interface';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('ORGANIZER')
// @UseGuards(AuthGuard)
@Controller('organizer')
export class OrganizerController {
  constructor(
    private organizerService: OrganizerService,
    private eventEmitter: EventEmitter2,
  ) {}

  // @UseGuards(RpcAuthGuard)
  // @MessagePattern('celica_organizer')
  // async handleOrganizerEvent(
  //   @Payload() data: TransportAction<any>,
  // ): Promise<void> {
  //   console.log('FROM KAFKA => ', data);
  //   //await this.organizerService.transportAction(data);
  // }

  @Post()
  @SharedResponse(OrganizerResponseDto)
  async registerOrganizer(
    @Body() organizer: CreateOrganizerDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<Organizer> {
    organizer.owner = user.sub;
    const org = await this.organizerService.createOrganizer(organizer);
    this.eventEmitter.emit('affiliate.create', {
      user: user.sub,
      organizer: org.id,
    });
    return org;
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
