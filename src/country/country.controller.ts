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
import { CountryService } from './country.service';
import {
  SharedPaginatedResponse,
  SharedResponse,
} from '../shared/decorators/response.decorators';
import {
  CountryResponseDto,
  CreateCountryDto,
  UpdateCountryDto,
} from './country.dtos';
import {
  ExtractRequestPagination,
  SharedQueryExtractor,
} from '../shared/decorators/query.decorators';
import { DefaultPagination } from '../shared/interfaces/pagination.interface';
import { Country } from './country.entity';
import { Roles } from '../shared/decorators/roles.decorators';
import { ROLE } from '../roles/role.entity';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';

@ApiTags('COUNTRY')
@UseGuards(AuthGuard)
@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Post()
  @SharedResponse(CountryResponseDto)
  @Roles(ROLE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async createCountry(@Body() country: CreateCountryDto): Promise<Country> {
    return await this.countryService.createCountry(country);
  }

  @Get()@Roles(ROLE.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @SharedPaginatedResponse(CountryResponseDto)
  async listCountries(
    @SharedQueryExtractor() query: any,
    @ExtractRequestPagination() pagination: DefaultPagination,
  ): Promise<[Country[], number]> {
    return await this.countryService.filterCountries(pagination, query);
  }

  @Get(':id')
  @SharedResponse(CountryResponseDto, 200)
  async getCountry(@Param('id') id: string): Promise<Country> {
    return await this.countryService.filterCountry({ id: id });
  }

  @Patch(':id')
  @SharedResponse(CountryResponseDto, 200)
  async updateCountry(
    @Param('id') id: string,
    @Body() country: UpdateCountryDto,
  ): Promise<Country> {
    return await this.countryService.updateCountry({ id: id }, country);
  }
}
