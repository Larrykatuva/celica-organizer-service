import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './country.dtos';
import { DefaultPagination } from '../shared/interfaces/pagination.interface';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {}

  async filterCountry(filterOptions: any): Promise<Country | null> {
    try {
      return await this.countryRepository.findOneBy({ ...filterOptions });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createCountry(country: CreateCountryDto): Promise<Country> {
    if (await this.filterCountry({ name: country.name }))
      throw new BadRequestException('Country name already registered');
    if (await this.filterCountry({ code: country.code }))
      throw new BadRequestException('Country code already registered');
    return await this.countryRepository.save(country);
  }

  async filterCountries(
    pagination: DefaultPagination,
    queryOptions?: any,
    options?: any,
  ): Promise<[Country[], number]> {
    try {
      return await this.countryRepository.findAndCount({
        ...pagination,
        where: { ...queryOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCountry(
    filterOptions: any,
    updateFields: Partial<Country>,
  ): Promise<Country> {
    await this.countryRepository.update(
      { ...filterOptions },
      { ...updateFields },
    );
    return await this.filterCountry(filterOptions);
  }
}
