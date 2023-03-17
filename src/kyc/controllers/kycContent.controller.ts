import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorators';
import { ROLE } from '../../roles/role.entity';
import { ExtractRequestPagination } from '../../shared/decorators/query.decorators';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { KycContent } from '../entities/kycContent.entity';
import { RoleService } from '../../roles/role.service';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import {
  TokenInterface,
  UserInfoResponse,
} from '../../shared/interfaces/shared.interface';

@ApiTags('KYC')
@UseGuards(AuthGuard)
@Controller('content')
export class KycContentController {
  constructor(
    private kycContentService: KycContentService,
    private kycMappingService: KycMappingService,
    private organizerService: OrganizerService,
    private roleService: RoleService,
  ) {}

  @Post()
  @Roles(ROLE.SUPER_ADMIN, ROLE.BUSINESS, ROLE.CLIENT_ADMIN, ROLE.SUPPORT)
  @UseGuards(RolesGuard)
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
  @Roles(ROLE.SUPER_ADMIN, ROLE.BUSINESS, ROLE.CLIENT_ADMIN, ROLE.SUPPORT)
  async getKycContent(
    @ExtractRequestPagination() pagination: DefaultPagination,
    @ExtractRequestUser() user: UserInfoResponse,
  ): Promise<[KycContent[], number]> {
    const filterOptions = {};
    console.log(user);
    if (!(await this.roleService.isCelicaStaff(user.sub))) {
      const organizer = await this.organizerService.filterOrganizer({});
    }
    return await this.kycContentService.filterKycContents(pagination);
  }
}
