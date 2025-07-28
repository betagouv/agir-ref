import { Body, Controller, Put } from '@nestjs/common';
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
  async upsert_acteur(@Body() body: ActeurLVAO_API): Promise<void> {
    console.log(body);

    await this.lvao_usecase.upsert_acteur(body);
  }
}
