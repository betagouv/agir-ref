import {
  ArgumentMetadata,
  Body,
  Controller,
  Get,
  Injectable,
  PipeTransform,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ActionLVAO } from '../../domain/lvao/action_LVAO';
import { ObjetLVAO } from '../../domain/lvao/objet_LVAO';
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
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 2000 } })
  async count_acteurs(@Request() req) {
    this.checkCronAPIProtectedEndpoint(req);
    const count = await this.lvao_usecase.count_acteurs();
    return {
      count: count,
    };
  }
  @Get('lvao/acteurs')
  @ApiQuery({
    name: 'longitude',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'latitude',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: true,
    description: `Nombre max de résultats attendu`,
  })
  @ApiQuery({
    name: 'rayon_metres',
    type: Number,
    required: false,
    description: `distance max en mètres depuis le point pour sélectionner des résultats `,
  })
  @ApiQuery({
    name: 'action',
    enum: ActionLVAO,
    required: false,
    description: `Le type d'action que l'on souhaite réaliser : louer, emprunter, revendre, etc`,
  })
  @ApiQuery({
    name: 'objet',
    enum: ObjetLVAO,
    required: false,
    description: `Le type d'objet sur lequel on cherche à appliquer l'action : jouet, livre, etc`,
  })
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 2000 } })
  async liste_acteurs(
    @Request() req,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('limit') limit: number,
    @Query('rayon_metres') rayon_metres: number,
    @Query('action') action: ActionLVAO,
    @Query('objet') objet: ObjetLVAO,
  ) {
    this.checkCronAPIProtectedEndpoint(req);
    const result = await this.lvao_usecase.listActeurs(
      longitude,
      latitude,
      limit,
      rayon_metres,
      action,
      objet,
    );

    return result.map((e) => ActeurLVAO_API.mapToAPI(e));
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

    await this.lvao_usecase.smart_load_csv_lvao_buffer(file.buffer);
  }
}
