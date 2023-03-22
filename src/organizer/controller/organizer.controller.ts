import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
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
  RequestPaginationDecorator,
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
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ORGANIZER_ROLES, STAFF_ROLES } from '../../roles/role.entity';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import { RoleService } from '../../roles/role.service';
import { AffiliateService } from '../services/affiliate.service';

@ApiTags('ORGANIZER')
@UseGuards(AuthGuard)
@Controller('organizer')
export class OrganizerController {
  constructor(
    private organizerService: OrganizerService,
    private eventEmitter: EventEmitter2,
    private roleService: RoleService,
    private affiliateService: AffiliateService,
  ) {}

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
  @AuthRoles(...STAFF_ROLES)
  @RequestPaginationDecorator(OrganizerResponseDto)
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
  @AuthRoles(...STAFF_ROLES, ...ORGANIZER_ROLES)
  @SharedResponse(OrganizerResponseDto)
  async updateOrganizer(
    @Param('sub') sub: string,
    @Body() data: UpdateOrganizerDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<Organizer> {
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      const affiliate = await this.affiliateService.filterAffiliateUser({
        user: { sub: user.sub },
      });
      if (!affiliate) throw new BadRequestException('Organizer not found');
      if (affiliate.organizer.sub != sub)
        throw new BadRequestException('Organizer not found');
    }
    return await this.organizerService.updateOrganizer({
      sub: sub,
      updateData: data,
    });
  }
}
