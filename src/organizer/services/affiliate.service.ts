import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Affiliate } from '../entity/affiliate.entity';
import { CreateAffiliateDto } from '../dtos/affiliate.dtos';
import { UserService } from '../../shared/services/user.service';
import { OrganizerService } from './organizer.service';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { RoleService } from '../../roles/role.service';
import { ROLE } from '../../roles/role.entity';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
    private userService: UserService,
    private organizerService: OrganizerService,
    private roleService: RoleService,
  ) {}

  async filterAffiliateUser(filterOptions: any): Promise<Affiliate> {
    try {
      return await this.affiliateRepository.findOneBy({ ...filterOptions });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Add new organizer affiliate.
   * @param affiliate
   */
  async addAffiliateUser(affiliate: CreateAffiliateDto): Promise<Affiliate> {
    const user = await this.userService.filterUser({ sub: affiliate.user });
    if (!user) throw new BadRequestException('Invalid user');
    const organizer = await this.organizerService.filterOrganizer({
      id: affiliate.organizer,
    });
    if (
      await this.filterAffiliateUser({
        user: { sub: user.sub },
        organizer: { id: organizer.id },
      })
    )
      throw new BadRequestException(
        `${user.email} is already an affiliate of this organizer`,
      );
    return await this.affiliateRepository.save({
      user: user,
      organizer: organizer,
    });
  }

  /**
   * Create an organizer affiliate and add ORGANIZER_ADMIN role to the user.
   * @param payload
   */
  @OnEvent('affiliate.create')
  async handleAffiliateCreateEvent(payload: {
    user: string;
    organizer: string;
  }) {
    await this.addAffiliateUser(payload);
    await this.roleService.assignRole(
      { role: ROLE.ORGANIZER_ADMIN, user: payload.user },
      payload.user,
    );
  }

  /**
   * Filter paginated list of organizer affiliates.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterOrganizerAffiliates(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: any,
  ): Promise<[Affiliate[], number]> {
    try {
      return await this.affiliateRepository.findAndCount({
        ...pagination,
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Activate or deactivate organizer affiliate.
   * @param filterOptions
   * @param isActive
   */
  async updateOrganizerAffiliate(
    filterOptions: any,
    isActive: boolean,
  ): Promise<Affiliate> {
    const affiliate = await this.filterAffiliateUser(filterOptions);
    if (!affiliate) throw new BadRequestException('Invalid affiliate Id');
    if (affiliate.active == isActive)
      throw new BadRequestException(
        `Affiliate is already ${affiliate.active ? 'active' : 'inactive'}`,
      );
    await this.affiliateRepository.update(
      { ...filterOptions },
      { active: isActive },
    );
    return await this.filterAffiliateUser(filterOptions);
  }
}
