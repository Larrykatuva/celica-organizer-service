import {
  BadRequestException,
  CACHE_MANAGER,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  GRANT_TYPE,
  RequestContentType,
  TCP_Action,
  TokenInterface,
  TransportAction,
} from '../../shared/interfaces/shared.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Organizer } from '../entity/organizer.entity';
import { Repository, UpdateResult } from 'typeorm';
import { RequestService } from '../../shared/services/request.service';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrganizerDto, UpdateOrganizerDto } from '../dtos/organizer.dtos';
import { CountryService } from '../../country/country.service';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectRepository(Organizer)
    private organizerRepository: Repository<Organizer>,
    private requestService: RequestService,
    private countryService: CountryService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private configService: ConfigService,
  ) {}

  /**
   * Perform action from transport event.
   * @param transportAction
   */
  async transportAction(
    transportAction: TransportAction<any>,
  ): Promise<Organizer | UpdateResult> {
    switch (transportAction.action) {
      case TCP_Action.CREATE: {
        return await this.createOrganizer(transportAction.data);
      }
      case TCP_Action.UPDATE: {
        return await this.updateOrganizer(transportAction.data);
      }
      default: {
        break;
      }
    }
  }

  async filterOrganizer(filterOptions: any): Promise<Organizer | null> {
    try {
      return await this.organizerRepository.findOneBy({ ...filterOptions });
    } catch (error) {
      return null;
    }
  }

  async filterOrganizers(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: any,
  ): Promise<[Organizer[], number]> {
    try {
      return await this.organizerRepository.findAndCount({
        ...pagination,
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      return [[], 0];
    }
  }

  async generateOrganizerSub(): Promise<string> {
    const uuid = uuidv4();
    if (await this.filterOrganizer({ sub: uuid }))
      return await this.generateOrganizerSub();
    return uuid;
  }

  async createOrganizer(organizer: CreateOrganizerDto): Promise<Organizer> {
    const country = await this.countryService.filterCountry({
      id: organizer.country,
    });
    if (!country) throw new BadRequestException('Country not found');
    const owner = await this.userService.filterUser({ sub: organizer.owner });
    if (!owner) throw new BadRequestException('User not found');
    organizer['sub'] = await this.generateOrganizerSub();
    organizer.owner = owner;
    organizer.country = country;
    return await this.organizerRepository.save(organizer);
  }

  async updateOrganizer(data: {
    sub: string;
    updateData: UpdateOrganizerDto;
  }): Promise<Organizer> {
    await this.organizerRepository.update(
      { sub: data.sub },
      { ...data.updateData },
    );
    return await this.filterOrganizer({ sub: data.sub });
  }

  /**
   * Get application authentication token. Check if token already exists in the
   * cache and return it else make a post request to auth service for a new access token.
   */
  async getAppToken(): Promise<any> {
    const token = await this.cacheService.get<TokenInterface>(
      `${this.configService.get<string>('SERVICE_NAME')}_TOKEN`,
    );
    if (token) return token.access_token;
    const { data } = await this.requestService.postRequest<TokenInterface>(
      `${this.configService.get<string>('AUTH_URL')}/token`,
      {
        grant_type: GRANT_TYPE.CLIENT_CREDENTIALS,
        client_id: this.configService.get<string>('CLIENT_ID'),
        client_secret: this.configService.get<string>('CLIENT_SECRET'),
      },
      RequestContentType.FORM_URLENCODED,
    );
    await this.cacheService.set(
      `${this.configService.get<string>('SERVICE_NAME')}_TOKEN`,
      data,
      this.configService.get<number>('CACHE_DURATION'),
    );
    return data.access_token;
  }

  /**
   * Verify an access token by calling celica auth service.
   * @param token
   */
  async verifyAppToken(token: string): Promise<boolean> {
    try {
      const { data } = await this.requestService.postRequest<{
        valid: boolean;
      }>(
        `${this.configService.get<string>('AUTH_URL')}/token`,
        { token: token },
        RequestContentType.FORM_URLENCODED,
        await this.getAppToken(),
      );
      return !!data.valid;
    } catch (error) {
      return false;
    }
  }
}
