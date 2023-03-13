import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KycMapping } from '../entities/kycMapping.entity';
import { Repository } from 'typeorm';
import {
  CreateKycMapping,
  KycField,
  UpdateKycMappingDto,
} from '../dtos/kycMapping.dtos';
import { CountryService } from '../../country/country.service';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class KycMappingService {
  constructor(
    @InjectRepository(KycMapping)
    private kycMappingRepository: Repository<KycMapping>,
    private countryService: CountryService,
  ) {}

  prepareKycFieldData(kycField?: KycField | null): string | null {
    if (!kycField) return null;
    return JSON.stringify(kycField);
  }

  async configureCountryKyc(kycMapping: CreateKycMapping): Promise<KycMapping> {
    if (await this.filterKycMapping({ country: { id: kycMapping.country } }))
      throw new BadRequestException(
        `Kyc mapping already configured for this country`,
      );
    const country = await this.countryService.filterCountry({
      id: kycMapping.country,
    });
    if (!country) throw new BadRequestException('Invalid country id');
    kycMapping['country'] = country;
    return await this.kycMappingRepository.save({
      country: country,
      field1: this.prepareKycFieldData(kycMapping.field1),
      field2: this.prepareKycFieldData(kycMapping.field2),
      field3: this.prepareKycFieldData(kycMapping.field3),
      field4: this.prepareKycFieldData(kycMapping.field4),
      field5: this.prepareKycFieldData(kycMapping.field5),
      field6: this.prepareKycFieldData(kycMapping.field6),
      field7: this.prepareKycFieldData(kycMapping.field7),
      field8: this.prepareKycFieldData(kycMapping.field8),
      field9: this.prepareKycFieldData(kycMapping.field9),
      field10: this.prepareKycFieldData(kycMapping.field10),
    });
  }

  async filterKycMapping(
    filterOptions: any,
    options?: any,
  ): Promise<KycMapping | null> {
    try {
      return await this.kycMappingRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      return null;
    }
  }

  async filterKycMappings(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: any,
  ): Promise<[KycMapping[], number]> {
    try {
      return await this.kycMappingRepository.findAndCount({
        ...pagination,
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      return [[], 0];
    }
  }

  async updateKycMapping(
    filterOptions: any,
    updateFields: UpdateKycMappingDto,
  ): Promise<KycMapping> {
    const mapping = await this.filterKycMapping(filterOptions);
    if (!mapping) throw new BadRequestException('Kyc Mapping not found');
    if (updateFields.country) {
      updateFields.country = await this.countryService.filterCountry({
        id: updateFields.country,
      });
    }
    await this.kycMappingRepository.update(
      { ...filterOptions },
      {
        country: updateFields.country ? updateFields.country : mapping.country,
        field1: updateFields.field1
          ? mapping.field1
          : JSON.stringify(updateFields.field1),
        field2: updateFields.field2
          ? mapping.field2
          : JSON.stringify(updateFields.field2),
        field3: updateFields.field3
          ? mapping.field3
          : JSON.stringify(updateFields.field3),
        field4: updateFields.field4
          ? mapping.field4
          : JSON.stringify(updateFields.field4),
        field5: updateFields.field5
          ? mapping.field5
          : JSON.stringify(updateFields.field5),
        field6: updateFields.field6
          ? mapping.field6
          : JSON.stringify(updateFields.field6),
        field7: updateFields.field7
          ? mapping.field7
          : JSON.stringify(updateFields.field7),
        field8: updateFields.field8
          ? mapping.field8
          : JSON.stringify(updateFields.field8),
        field9: updateFields.field9
          ? mapping.field9
          : JSON.stringify(updateFields.field9),
        field10: updateFields.field10
          ? mapping.field10
          : JSON.stringify(updateFields.field10),
      },
    );
    return await this.filterKycMapping(filterOptions);
  }
}
