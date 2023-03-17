import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrganizerService } from '../../organizer/services/organizer.service';

/**
 * Auth guard to protect rpc transport endpoints by verifying the access token.
 */
@Injectable()
export class RpcAuthGuard implements CanActivate {
  constructor(private organizerService: OrganizerService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {
      headers: { token },
    } = context.switchToRpc().getContext();
    if (token) throw new RpcException('Invalid credentials.');
    if (await this.organizerService.verifyAppToken(token)) return true;
    throw new RpcException('Invalid authentication token');
  }
}
