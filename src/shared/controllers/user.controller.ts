import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransportAction } from '../interfaces/shared.interface';
import { RpcAuthGuard } from '../guards/transport.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RpcAuthGuard)
  @MessagePattern('celica_user')
  async handleUserEvent(@Payload() data: TransportAction<any>): Promise<void> {
    await this.userService.transportAction(data);
  }
}
