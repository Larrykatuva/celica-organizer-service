import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../services/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { UserCommand } from '../commands/impl/user.command';
import { USER } from '../dto/auth.dto';

/**
 * Authentication guard to authenticate request token.
 * It depends on authentication service to determine if token is valid or not.
 * It also creates user instance through a command if he/she does not exist in the users table.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private commandBus: CommandBus,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const {
      headers: { authorization },
    } = request;
    if (!authorization)
      throw new UnauthorizedException('No authorization was provided');
    const token = authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid authorization token');
    const status = await this.userService.verifyUserToken(token);
    if (!status.active) throw new UnauthorizedException('Authorization failed');
    if (status.type == USER.APP) return true;
    const user = await this.userService.getUserInfo(token);
    request['user'] = user;
    await this.commandBus.execute(
      new UserCommand(user.email, user.firstName, user.lastName, user.sub),
    );
    return true;
  }
}
