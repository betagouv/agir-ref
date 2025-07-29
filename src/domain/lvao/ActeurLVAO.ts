import { LabelLVAO } from './LabelLVAO';
import { ObjetLVAO } from './objetLVAO';
import { PublicLVAO } from './publicLVAO';
import { SourceLVAO } from './sourceLVAO';
import { TypeActeurLVAO } from './typeActeurLVAO';
import { TypeServiceLVAO } from './typeServiceLVAO';

export class InnerActionLVAO {
  action: string;
  sous_categfories: string[];
}

export class ActeurLVAO {
  id: string;
  sources: SourceLVAO[];
  nom: string;
  nom_commercial: string;
  siren: string;
  siret: string;
  description: string;
  type_acteur: TypeActeurLVAO;
  url: string;
  telephone: string;
  adresse: string;
  complement_adresse: string;
  code_postal: string;
  ville: string;
  latitude: number;
  longitude: number;
  labels: LabelLVAO[];
  type_public: PublicLVAO;
  reprise: string;
  reprise_exclusif: boolean;
  sur_rdv: boolean;
  types_service: TypeServiceLVAO[];
  detail_services: InnerActionLVAO[];
  date_derniere_maj: Date;
  emprunter: ObjetLVAO[];
  preter: ObjetLVAO[];
  louer: ObjetLVAO[];
  mettreenlocation: ObjetLVAO[];
  reparer: ObjetLVAO[];
  donner: ObjetLVAO[];
  trier: ObjetLVAO[];
  echanger: ObjetLVAO[];
  revendre: ObjetLVAO[];
  acheter: ObjetLVAO[];

  constructor(acteur: ActeurLVAO) {
    Object.assign(this, acteur);
  }
}
