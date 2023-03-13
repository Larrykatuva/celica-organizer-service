import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizerService } from '../../organizer/organizer.service';
import { RpcAuthGuard } from '../guards/transport.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransportAction } from '../interfaces/shared.interface';

@Controller('organizer')
@ApiTags('Organizer')
export class OrganizerController {
  constructor(private organizerService: OrganizerService) {}

  @UseGuards(RpcAuthGuard)
  @MessagePattern('celica_organizer')
  async handleOrganizerEvent(
    @Payload() data: TransportAction<any>,
  ): Promise<void> {
    await this.organizerService.transportAction(data);
  }
}
