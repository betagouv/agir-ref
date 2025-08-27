import { ApiProperty } from '@nestjs/swagger';
import { ActeurLVAO } from '../../../domain/lvao/acteur_LVAO';
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
  @ApiProperty({ required: false }) distance_metres?: number;
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

  public static mapToAPI(acteur: ActeurLVAO): ActeurLVAO_API {
    return {
      acheter: acteur.acheter,
      adresse: acteur.adresse,
      code_postal: acteur.code_postal,
      complement_adresse: acteur.complement_adresse,
      date_derniere_maj: acteur.date_derniere_maj,
      description: acteur.description,
      detail_services: acteur.detail_services,
      donner: acteur.donner,
      echanger: acteur.echanger,
      emprunter: acteur.emprunter,
      id: acteur.id,
      labels: acteur.labels,
      latitude: acteur.latitude,
      longitude: acteur.longitude,
      louer: acteur.louer,
      mettreenlocation: acteur.mettreenlocation,
      nom: acteur.nom,
      nom_commercial: acteur.nom_commercial,
      preter: acteur.preter,
      reparer: acteur.reparer,
      reprise: acteur.reprise,
      reprise_exclusif: acteur.reprise_exclusif,
      revendre: acteur.revendre,
      siren: acteur.siren,
      siret: acteur.siret,
      sources: acteur.sources,
      sur_rdv: acteur.sur_rdv,
      telephone: acteur.telephone,
      trier: acteur.trier,
      type_acteur: acteur.type_acteur,
      ville: acteur.ville,
      url: acteur.url,
      type_public: acteur.type_public,
      types_service: acteur.types_service,
      distance_metres: acteur.distance_metres,
    };
  }
}
