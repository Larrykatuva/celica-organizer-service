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
import { KycMappingService } from '../services/kycMapping.service';
import {
  CreateKycMapping,
  KycMappingResponseDto,
  UpdateKycMappingDto,
} from '../dtos/kycMapping.dtos';
import { KycMapping } from '../entities/kycMapping.entity';
import {
  RequestPaginationDecorator,
  SharedResponse,
} from '../../shared/decorators/response.decorators';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../../shared/decorators/query.decorators';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import { ROLE } from '../../roles/role.entity';
import { AuthGuard } from '../../shared/guards/auth.guard';

@ApiTags('KYC')
@UseGuards(AuthGuard)
@Controller('mapping')
export class KycMappingController {
  constructor(private kycMappingService: KycMappingService) {}

  @Post()
  @AuthRoles(ROLE.SUPER_ADMIN)
  @SharedResponse(KycMappingResponseDto)
  async configure(@Body() kycMapping: CreateKycMapping): Promise<KycMapping> {
    return await this.kycMappingService.configureCountryKyc(kycMapping);
  }

  @Get()
  @RequestPaginationDecorator(KycMappingResponseDto)
  async listKycMappings(
    @ExtractRequestPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[KycMapping[], number]> {
    return await this.kycMappingService.filterKycMappings(pagination, query, {
      relations: ['country'],
    });
  }

  @Get(':country')
  @SharedResponse(KycMappingResponseDto, 200)
  async getKycMapping(@Param('country') country: string): Promise<KycMapping> {
    return await this.kycMappingService.filterKycMapping(
      {
        country: { id: country },
      },
      { relations: ['country'] },
    );
  }

  @Patch(':id')
  @AuthRoles(ROLE.SUPER_ADMIN)
  @SharedResponse(KycMappingResponseDto, 200)
  async updateKycMapping(
    @Param('id') id: string,
    @Body() updateData: UpdateKycMappingDto,
  ): Promise<KycMapping> {
    return await this.kycMappingService.updateKycMapping(
      { id: id },
      updateData,
    );
  }
}
