import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KycContent } from '../entities/kycContent.entity';
import { Repository } from 'typeorm';
import { KycMappingService } from './kycMapping.service';
import { KycMapping } from '../entities/kycMapping.entity';
import { KycField, KycFieldType } from '../dtos/kycMapping.dtos';
import { Organizer } from '../../organizer/entity/organizer.entity';
import { OrganizerService } from '../../organizer/services/organizer.service';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class KycContentService {
  constructor(
    @InjectRepository(KycContent)
    private kycContentRepository: Repository<KycContent>,
    private kycMappingService: KycMappingService,
    private organizerService: OrganizerService,
  ) {}

  /**
   * Get set fields of kyc content from the kyc mapping configuration.
   * @param kycMapping
   */
  getFieldAttributes(kycMapping: KycMapping): Partial<KycField>[] {
    delete kycMapping.id;
    delete kycMapping.createdAt;
    delete kycMapping.updatedAt;
    const mappingToArr = Object.entries(kycMapping);
    const setAttributes = [];
    for (let i = 0; i < mappingToArr.length; i++) {
      if (mappingToArr[i][1])
        setAttributes.push({
          field: mappingToArr[i][0],
          ...JSON.parse(mappingToArr[i][1]),
        });
    }
    return setAttributes;
  }

  /**
   * Check if field has required text key.
   * @param key
   * @param keyArr
   */
  checkIfIncludeTextKey(key: any, keyArr: any[]): string | null {
    for (let i = 0; i < keyArr.length; i++) {
      if (keyArr[i][0] == key.name) return keyArr[i][1];
    }
    return null;
  }

  /**
   * Check if field has required file key.
   * @param key
   * @param keyArr
   */
  checkIfIncludeFileKey(key: any, keyArr: any): any {
    for (let i = 0; i < keyArr.length; i++) {
      if (keyArr[i]['fieldname'] == key.name) return keyArr[i];
    }
    return null;
  }

  /**
   * Validate kyc content against its kyc mapping and ensuring all required field are supplied and validated.
   * @param kycMapping
   * @param textObject
   * @param filesArray
   */
  async validateKycMappingContent(
    kycMapping: string,
    textObject: any,
    filesArray: any[],
  ) {
    const mapping = await this.kycMappingService.filterKycMapping({
      id: kycMapping,
    });
    const textFieldsArr = Object.entries(textObject);
    const setFields = this.getFieldAttributes(mapping);
    const result = [];
    for (let i = 0; i < setFields.length; i++) {
      if (setFields[i].type == KycFieldType.TEXT) {
        const value = this.checkIfIncludeTextKey(setFields[i], textFieldsArr);
        if (!value) {
          if (setFields[i].required)
            throw new BadRequestException(`${setFields[i].name} is required`);
        } else {
          const temp = {};
          temp[setFields[i]['field']] = value;
          result.push(temp);
        }
      } else {
        const value = this.checkIfIncludeFileKey(setFields[i], filesArray);
        if (!value) {
          if (setFields[i].required)
            throw new BadRequestException(`${setFields[i].name} is required`);
        } else {
          const temp = {};
          temp[setFields[i]['field']] = value;
          result.push(temp);
        }
      }
    }
    return result;
  }

  /**
   * Filter kyc content by filter options and extra specified options.
   * @param filterOptions
   * @param options
   */
  async filterKycContent(
    filterOptions: any,
    options?: any,
  ): Promise<KycContent> {
    try {
      return await this.kycContentRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * return paginated list of kyc content by optional filter options.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterKycContents(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: any,
  ): Promise<[KycContent[], number]> {
    try {
      return await this.kycContentRepository.findAndCount({
        ...pagination,
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      return [[], 0];
    }
  }

  /**
   * Save a record of validated kyc content.
   * @param kycFields
   * @param kycMapping
   * @param organizer
   */
  async saveKycContent(
    kycFields: any[],
    kycMapping: KycMapping,
    organizer: Organizer,
  ): Promise<KycContent> {
    console.log(organizer);
    if (await this.filterKycContent({ organizer: { id: organizer.id } }))
      throw new BadRequestException('Organizer kyc already processed');
    const kycInstanceArr = [];
    for (let i = 0; i < kycFields.length; i++) {
      const field: [string, any] = Object.entries(kycFields[i])[0];
      let temp = [];
      if (typeof field[1] != 'string') {
        temp = [[field[0]], field[1]['originalname']];
      } else {
        temp = [[field[0]], field[1]];
      }
      kycInstanceArr.push(temp);
    }
    const kycInstanceObj = Object.fromEntries(kycInstanceArr);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await this.kycContentRepository.save({
      organizer: organizer,
      kycMapping: kycMapping,
      ...kycInstanceObj,
    });
  }
}
