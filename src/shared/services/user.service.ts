import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import {
  TCP_Action,
  TokenVerifyResponse,
  TransportAction,
  UserInfoResponse,
} from '../interfaces/shared.interface';
import { Repository, UpdateResult } from 'typeorm';
import { RequestService } from './request.service';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private requestService: RequestService,
    private configService: ConfigService,
  ) {}

  /**
   * Perform action from transport event.
   * @param transportAction
   */
  async transportAction(
    transportAction: TransportAction<any>,
  ): Promise<User | UpdateResult> {
    switch (transportAction.action) {
      case TCP_Action.CREATE: {
        return await this.createUser(transportAction.data);
      }
      case TCP_Action.UPDATE: {
        return await this.updateUser(transportAction.data);
      }
      default: {
        break;
      }
    }
  }

  async createUser(user: any): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updateUser(data: {
    sub: string;
    updateData: Partial<User>;
  }): Promise<UpdateResult> {
    return await this.userRepository.update(
      { sub: data.sub },
      { ...data.updateData },
    );
  }

  async filterUser(filterOptions: any): Promise<User> {
    return await this.userRepository.findOneBy({ ...filterOptions });
  }

  /**
   * Verify user token by calling auth service for validation.
   * @param token
   */
  async verifyUserToken(token: string): Promise<TokenVerifyResponse> {
    const { data } = await this.requestService.postRequest<TokenVerifyResponse>(
      `${this.configService.get<string>('AUTH_URL')}/auth/introspect`,
      {
        client_secret: this.configService.get('CLIENT_SECRET'),
        client_id: this.configService.get<string>('CLIENT_ID'),
        token: token,
      },
    );
    return data;
  }

  /**
   * Get user information form the auth service.
   * @param token
   */
  async getUserInfo(token: string): Promise<UserInfoResponse> {
    const user = await this.cacheService.get<UserInfoResponse>(token);
    if (user) return user;
    const { data } = await this.requestService.postRequest<TokenVerifyResponse>(
      `${this.configService.get<string>('AUTH_URL')}/auth/userinfo`,
      {
        client_secret: this.configService.get('CLIENT_SECRET'),
        client_id: this.configService.get<string>('CLIENT_ID'),
        token: token,
      },
    );
    await this.cacheService.set(
      token,
      data,
      this.configService.get<number>('AUTH_EXPIRY'),
    );
    return data;
  }
}
