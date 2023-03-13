import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCommand } from '../impl/user.command';
import { UserService } from '../../services/user.service';

/**
 * Command handler for user commands.
 * It creates a new user record if he/she does not exist and also updates the user record if he/she
 * exist and data need to be updated.
 */
@CommandHandler(UserCommand)
export class UserCommandHandler implements ICommandHandler<UserCommand> {
  constructor(private userService: UserService) {}

  async execute(command: UserCommand): Promise<any> {
    const user = await this.userService.filterUser({ sub: command.sub });
    if (!user) {
      await this.userService.createUser({
        sub: command.sub,
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
      });
    }
    await this.userService.updateUser({
      sub: command.sub,
      updateData: {
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
      },
    });
  }
}
