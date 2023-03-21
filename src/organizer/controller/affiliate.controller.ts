import { AffiliateService } from '../services/affiliate.service';
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
import { AuthGuard } from '../../shared/guards/auth.guard';
import {
  AffiliateResponseDto,
  CreateAffiliateDto,
  SetAffiliateStatusDto,
} from '../dtos/affiliate.dtos';
import { Affiliate } from '../entity/affiliate.entity';
import { Roles } from '../../shared/decorators/roles.decorators';
import { ROLE } from '../../roles/role.entity';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { RoleService } from '../../roles/role.service';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../../shared/decorators/response.decorators';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../../shared/decorators/query.decorators';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@ApiTags('ORGANIZER')
@Controller('affiliate')
@UseGuards(AuthGuard)
export class AffiliateController {
  constructor(
    private affiliateService: AffiliateService,
    private roleService: RoleService,
  ) {}

  @Post()
  @SharedResponse(AffiliateResponseDto)
  @Roles(ROLE.SUPER_ADMIN, ROLE.SUPPORT, ROLE.ORGANIZER_ADMIN, ROLE.BUSINESS)
  @UseGuards(RolesGuard)
  async addOrganizerAffiliate(
    @Body() affiliate: CreateAffiliateDto,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<Affiliate> {
    if (await this.roleService.isCelicaStaff(user.sub)) {
      return await this.affiliateService.addAffiliateUser(affiliate);
    }
    const organizer = await this.affiliateService.filterAffiliateUser({
      user: { sub: user.sub },
    });
    affiliate.organizer = organizer.id;
    return await this.affiliateService.addAffiliateUser(affiliate);
  }

  @Get()
  @SharedPaginatedResponse(AffiliateResponseDto)
  @Roles(ROLE.SUPER_ADMIN, ROLE.SUPPORT, ROLE.ORGANIZER_ADMIN, ROLE.BUSINESS)
  @UseGuards(RolesGuard)
  async listOrganizerAffiliates(
    @ExtractRequestUser() user: UserInfoResponse,
    @ExtractRequestPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[Affiliate[], number]> {
    if (await this.roleService.isCelicaStaff(user.sub)) {
      return await this.affiliateService.filterOrganizerAffiliates(pagination, {
        ...query,
      });
    }
    const organizer = await this.affiliateService.filterAffiliateUser({
      user: { sub: user.sub },
    });
    return await this.affiliateService.filterOrganizerAffiliates(pagination, {
      organizer: { id: organizer.id },
      ...query,
    });
  }

  @Get(':id')
  @SharedResponse(AffiliateResponseDto)
  @Roles(ROLE.SUPER_ADMIN, ROLE.SUPPORT, ROLE.ORGANIZER_ADMIN, ROLE.BUSINESS)
  @UseGuards(RolesGuard)
  async getOrganizerAffiliate(
    @Param('id') id: string,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<Affiliate> {
    if (await this.roleService.isCelicaStaff(user.sub)) {
      return await this.affiliateService.filterAffiliateUser({
        user: { sub: user.sub },
      });
    }
    const organizer = await this.affiliateService.filterAffiliateUser({
      user: { sub: user.sub },
    });
    return await this.affiliateService.filterAffiliateUser({
      user: { sub: user.sub },
      organizer: { id: organizer.id },
    });
  }

  @Patch(':id')
  @SharedResponse(AffiliateResponseDto)
  @Roles(ROLE.SUPER_ADMIN, ROLE.SUPPORT, ROLE.ORGANIZER_ADMIN, ROLE.BUSINESS)
  @UseGuards(RolesGuard)
  async updateOrganizerAffiliate(
    @ExtractRequestUser() user: UserInfoResponse,
    @Param('id') id: string,
    @Body() updateBody: SetAffiliateStatusDto,
  ): Promise<Affiliate> {
    if (await this.roleService.isCelicaStaff(user.sub)) {
      return await this.affiliateService.updateOrganizerAffiliate(
        {
          user: { sub: user.sub },
        },
        updateBody.status,
      );
    }
    const organizer = await this.affiliateService.filterAffiliateUser({
      user: { sub: user.sub },
    });
    return await this.affiliateService.updateOrganizerAffiliate(
      {
        user: { sub: user.sub },
        organizer: { id: organizer.id },
      },
      updateBody.status,
    );
  }
}
