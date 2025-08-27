import { ApiProperty } from '@nestjs/swagger';

export class ActeurSearch_API {
  @ApiProperty() longitude: number;
  @ApiProperty() latitude: number;
  @ApiProperty() limit: number;
}
