import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { KycContentService } from '../services/kycContent.service';
import { KycMappingService } from '../services/kycMapping.service';
import { OrganizerService } from '../../organizer/services/organizer.service';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import { ORGANIZER_ROLES, STAFF_ROLES } from '../../roles/role.entity';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../../shared/decorators/query.decorators';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { KycContent } from '../entities/kycContent.entity';
import { RoleService } from '../../roles/role.service';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { UserInfoResponse } from '../../shared/interfaces/shared.interface';
import { RequestPaginationDecorator } from '../../shared/decorators/response.decorators';
import { KycResponseDto } from '../dtos/kycContent.dtos';
import { AffiliateService } from '../../organizer/services/affiliate.service';

@ApiTags('KYC')
@Controller('content')
export class KycContentController {
  constructor(
    private kycContentService: KycContentService,
    private kycMappingService: KycMappingService,
    private organizerService: OrganizerService,
    private roleService: RoleService,
    private affiliateService: AffiliateService,
  ) {}

  @Post()
  @AuthRoles(...STAFF_ROLES, ...ORGANIZER_ROLES)
  @UseInterceptors(AnyFilesInterceptor())
  async setKycContent(
    @Body() content: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    if (!content['kycMapping'])
      throw new BadRequestException('Kyc mapping is required');
    let kycMapping = content['kycMapping'];
    delete content['kycMapping'];
    const validatedData =
      await this.kycContentService.validateKycMappingContent(
        kycMapping,
        content,
        files,
      );
    kycMapping = await this.kycMappingService.filterKycMapping({
      id: kycMapping,
    });
    return await this.kycContentService.saveKycContent(
      validatedData,
      kycMapping,
      content['organizer'],
    );
  }

  @Get()
  @AuthRoles(...STAFF_ROLES, ...ORGANIZER_ROLES)
  @RequestPaginationDecorator(KycResponseDto)
  async getKycContents(
    @ExtractRequestPagination() pagination: DefaultPagination,
    @ExtractRequestUser() user: UserInfoResponse,
    @SharedQueryExtractor() query: any,
  ): Promise<[KycContent[], number]> {
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      const affiliate = await this.affiliateService.isAffiliate({
        user: { sub: user.sub },
      });
      query = { organizer: { id: affiliate.organizer.id }, ...query };
    }
    return await this.kycContentService.filterKycContents(pagination, query, {
      relations: ['organizer', 'kycMapping'],
    });
  }

  @Get(':id')
  @AuthRoles(...STAFF_ROLES, ...ORGANIZER_ROLES)
  async getKycContent(
    @Param('id') id: string,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<KycContent> {
    const query = { id: id };
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      const affiliate = await this.affiliateService.isAffiliate({
        user: { sub: user.sub },
      });
      query['organizer'] = { id: affiliate.organizer.id };
    }
    return this.kycContentService.filterKycContent(query, {
      relations: ['organizer', 'kycMapping'],
    });
  }
}
