import {
  ArgumentMetadata,
  Body,
  Controller,
  Get,
  Injectable,
  PipeTransform,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { LVAOUsecase } from '../../usecase/lvao.usecase';
import { GenericControler } from './genericControler';
import { ActeurLVAO_API } from './types/ActeurLVAOAPI';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const oneKb = 1000;
    return value.size < oneKb * 1000 * 50;
  }
}

export class FileBody {
  @ApiProperty({
    description: 'csv file',
    format: 'binary',
    type: String,
  })
  file: Express.Multer.File;
}
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

  @Get('lvao/acteurs/count')
  async count_acteurs(@Request() req) {
    this.checkCronAPIProtectedEndpoint(req);
    const count = await this.lvao_usecase.count_acteurs();
    return {
      count: count,
    };
  }

  @Post('lvao/acteurs/recompute_geometry')
  async recompute_geometry(@Request() req) {
    this.checkCronAPIProtectedEndpoint(req);
    const count = await this.lvao_usecase.recompute_geometry();
    return {
      count: count,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadBatchCSV(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.checkCronAPIProtectedEndpoint(req);
    console.log(file);

    this.lvao_usecase.smart_load_csv_lvao_buffer(file.buffer);
  }
}
