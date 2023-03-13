import { ICommand } from '@nestjs/cqrs';

/**
 * Command to dispatch user commands.
 */
export class UserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly sub: string,
  ) {}
}
