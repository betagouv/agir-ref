import { ApiProperty } from '@nestjs/swagger';
import { ActionLVAO } from '../../../domain/lvao/action_LVAO';
import { LabelLVAO } from '../../../domain/lvao/label_LVAO';
import { ObjetLVAO } from '../../../domain/lvao/objet_LVAO';
import { PublicLVAO } from '../../../domain/lvao/public_LVAO';
import { SourceLVAO } from '../../../domain/lvao/source_LVAO';
import { TypeActeurLVAO } from '../../../domain/lvao/typeActeur_LVAO';
import { TypeServiceLVAO } from '../../../domain/lvao/typeService_LVAO';

export class ActionLVAO_API {
  @ApiProperty({ enum: ActionLVAO }) action: ActionLVAO;
  @ApiProperty({ enum: ObjetLVAO, isArray: true })
  sous_categories: ObjetLVAO[];
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
