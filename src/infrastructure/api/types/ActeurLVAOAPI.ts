import { ApiProperty } from '@nestjs/swagger';
import { LabelLVAO } from '../../../domain/lvao/LabelLVAO';
import { ObjetLVAO } from '../../../domain/lvao/objetLVAO';
import { PublicLVAO } from '../../../domain/lvao/publicLVAO';
import { SourceLVAO } from '../../../domain/lvao/sourceLVAO';
import { TypeActeurLVAO } from '../../../domain/lvao/typeActeurLVAO';
import { TypeServiceLVAO } from '../../../domain/lvao/typeServiceLVAO';

export class ActionLVAO_API {
  @ApiProperty() action: string;
  @ApiProperty() sous_categfories: string[];
}

export class ActeurLVAO_API {
  @ApiProperty() id: string;
  @ApiProperty({ enum: SourceLVAO, isArray: true }) sources: SourceLVAO[];
  @ApiProperty() nom: string;
  @ApiProperty() nom_commercial: string;
  @ApiProperty() siren: string;
  @ApiProperty() siret: string;
  @ApiProperty() description: string;
  @ApiProperty() type_acteur: TypeActeurLVAO;
  @ApiProperty() url: string;
  @ApiProperty() telephone: string;
  @ApiProperty() adresse: string;
  @ApiProperty() complement_adresse: string;
  @ApiProperty() code_postal: string;
  @ApiProperty() ville: string;
  @ApiProperty() latitude: number;
  @ApiProperty() longitude: number;
  @ApiProperty({ enum: LabelLVAO, isArray: true }) labels: LabelLVAO[];
  @ApiProperty() type_public: PublicLVAO;
  @ApiProperty() reprise: string;
  @ApiProperty() reprise_exclusif: boolean;
  @ApiProperty() sur_rdv: boolean;
  @ApiProperty({ enum: TypeServiceLVAO, isArray: true })
  types_service: TypeServiceLVAO[];
  @ApiProperty({ type: [ActionLVAO_API] }) detail_services: ActionLVAO_API[];
  @ApiProperty() date_derniere_maj: Date;
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) emprunter: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) preter: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) louer: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true })
  mettreenlocation: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) reparer: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) donner: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) trier: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) echanger: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) revendre: ObjetLVAO[];
  @ApiProperty({ enum: ObjetLVAO, isArray: true }) acheter: ObjetLVAO[];
}
