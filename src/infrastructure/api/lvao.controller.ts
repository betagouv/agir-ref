import { Body, Controller, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LVAOUsecase } from '../../usecase/lvao.usecase';
import { GenericControler } from './genericControler';
import { ActeurLVAO_API } from './types/ActeurLVAOAPI';

@Controller()
@ApiTags('LVAO')
@ApiBearerAuth()
export class LVAOController extends GenericControler {
  constructor(private lvao_usecase: LVAOUsecase) {
    super();
  }

  @Put('lvao/acteurs')
  @ApiBody({
    type: ActeurLVAO_API,
  })
  async upsert_acteur(
    @Request() req,
    @Body() body: ActeurLVAO_API,
  ): Promise<void> {
    this.checkCronAPIProtectedEndpoint(req);
    await this.lvao_usecase.upsert_acteur(body);
  }
}
