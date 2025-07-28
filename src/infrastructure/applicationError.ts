import { ApiProperty } from '@nestjs/swagger';

export class ApplicationError {
  @ApiProperty()
  code: string;
  @ApiProperty()
  message: string;
  http_status: number;
  @ApiProperty()
  message_tech: string;

  private constructor(
    code: string,
    message: string,
    http_status?: number,
    message_tech?: string,
  ) {
    this.code = code;
    this.message = message;
    this.http_status = http_status ? http_status : 400;
    this.message_tech = message_tech;
  }

  static throwInactiveAccountError() {
    this.throwAppError('001', 'Utilisateur non actif');
  }
  private static throwAppError(
    code: string,
    message: string,
    http_status?: number,
    message_tech?: string,
  ) {
    throw new ApplicationError(code, message, http_status, message_tech);
  }
}
