import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import fs from 'fs';
import { Stream } from 'stream';
import { ActeurLVAO, InnerActionLVAO } from '../domain/lvao/acteur_LVAO';
import { LabelLVAO } from '../domain/lvao/label_LVAO';
import { ObjetLVAO } from '../domain/lvao/objet_LVAO';
import { PublicLVAO } from '../domain/lvao/public_LVAO';
import { SourceLVAO } from '../domain/lvao/source_LVAO';
import { TypeActeurLVAO } from '../domain/lvao/typeActeur_LVAO';
import { TypeServiceLVAO } from '../domain/lvao/typeService_LVAO';
import { ActeurLVAO_API } from '../infrastructure/api/types/ActeurLVAOAPI';
import { LVAORepository } from '../infrastructure/repository/lvao.repository';

type LVAO_CSV_ROW = {
  identifiant: string; //'222dMMK2fP52fhyhjJcYMY',
  paternite: string; //'Longue Vie Aux Objets|ADEME|CRAR Normandie',
  nom: string; //'Repair Café Elbeuf-sur-Seine',
  nom_commercial: string; //'',
  siren: string; //'',
  siret: string; // "81794744300021",
  description: string; //'',
  type_dacteur: string; //'ess',
  site_web: string; //'https://www.mairie-elbeuf.fr/reouverture-du-repair-cafe/',
  telephone: string; //'',
  adresse: string; //'14\t\true \tde la République',
  complement_dadresse: string; //'Petit Atelier',
  code_postal: string; // '76500',
  ville: string; //'Elbeuf',
  latitude: string; //'49.290368251444505',
  longitude: string; //'1.001683363974231',
  qualites_et_labels: string; //'ess',
  public_accueilli: string; //'',
  reprise: string; //'',
  exclusivite_de_reprisereparation: string; //'',
  uniquement_sur_rdv: string; //'',
  type_de_services: string; //'atelier_pour_reparer_soi_meme',
  propositions_de_services: string; //'[{"action": "reparer", "sous_categories": ["luminaire", "materiel hifi et video", "vetement", "materiel informatique", "velo", "petit electromenager"]}]',
  emprunter: string; //'',
  preter: string; //'',
  louer: string; //'',
  mettreenlocation: '';
  reparer: string; //'luminaire|materiel hifi et video|materiel informatique|petit electromenager|velo|vetement',
  donner: string; //'',
  trier: string; //'',
  echanger: string; //'',
  revendre: string; //'',
  acheter: string; //'',
  date_de_derniere_modification: string; //'2024-06-17'
};

@Injectable()
export class LVAOUsecase {
  constructor(private lvaoRepository: LVAORepository) {}

  public async count_acteurs(): Promise<number> {
    return await this.lvaoRepository.countAll();
  }
  public async upsert_acteur(acteur: ActeurLVAO_API): Promise<void> {
    await this.lvaoRepository.upsert_acteur(this.parse_acteur_API(acteur));
  }

  public async smart_load_csv_lvao_buffer(buffer: Buffer) {
    const { Readable } = require('stream');
    const stream = Readable.from(buffer);
    await this.loadCsvStream_V2(stream);
  }

  public async smart_load_csv_lvao_file(csvFilePath: string) {
    let inputStream = fs.createReadStream(csvFilePath, 'utf8');
    await this.loadCsvStream_V2(inputStream);
  }

  private async loadCsvStream_V2(stream: Stream) {
    const parser = stream.pipe(parse({ columns: true }));
    let count = 0;
    // Iterate through each records
    for await (const record of parser) {
      const acteur = this.parse_acteur_CSV(record);
      await this.lvaoRepository.upsert_acteur(acteur);
      count++;
    }
    console.log(`Loaded  ${count} rows`);
  }

  private parse_acteur_CSV(row: LVAO_CSV_ROW): ActeurLVAO {
    let latitude = parseFloat(row.latitude);
    let longitude = parseFloat(row.longitude);
    if (Number.isNaN(latitude)) {
      latitude = null;
    }
    if (Number.isNaN(longitude)) {
      longitude = null;
    }
    const result = new ActeurLVAO({
      acheter: this.splitOrEmptyArray(row.acheter).map((e) => ObjetLVAO[e]),
      adresse: row.adresse,
      code_postal: row.code_postal,
      complement_adresse: row.complement_dadresse,
      date_derniere_maj: new Date(row.date_de_derniere_modification),
      description: row.description,
      detail_services: this.parsePropDeService(row.propositions_de_services),
      donner: this.splitOrEmptyArray(row.donner).map((e) => ObjetLVAO[e]),
      echanger: this.splitOrEmptyArray(row.echanger).map((e) => ObjetLVAO[e]),
      emprunter: this.splitOrEmptyArray(row.emprunter).map((e) => ObjetLVAO[e]),
      id: row.identifiant,
      labels: this.splitOrEmptyArray(row.qualites_et_labels).map(
        (e) => LabelLVAO[e],
      ),
      latitude: latitude,
      longitude: longitude,
      louer: this.splitOrEmptyArray(row.louer).map((e) => ObjetLVAO[e]),
      mettreenlocation: this.splitOrEmptyArray(row.mettreenlocation).map(
        (e) => ObjetLVAO[e],
      ),
      nom: row.nom,
      nom_commercial: row.nom_commercial,
      preter: this.splitOrEmptyArray(row.preter).map((e) => ObjetLVAO[e]),
      reparer: this.splitOrEmptyArray(row.reparer).map((e) => ObjetLVAO[e]),
      reprise: row.reprise,
      reprise_exclusif: row.exclusivite_de_reprisereparation !== 'f',
      revendre: this.splitOrEmptyArray(row.revendre).map((e) => ObjetLVAO[e]),
      siren: row.siren,
      siret: row.siret,
      sources: this.splitOrEmptyArray(row.paternite).map((e) => SourceLVAO[e]),
      sur_rdv: row.uniquement_sur_rdv !== 'f',
      telephone: row.telephone,
      trier: this.splitOrEmptyArray(row.trier).map((e) => ObjetLVAO[e]),
      type_acteur: TypeActeurLVAO[row.type_dacteur],
      type_public: PublicLVAO[row.public_accueilli],
      types_service: this.splitOrEmptyArray(row.type_de_services).map(
        (e) => TypeServiceLVAO[e],
      ),
      url: row.site_web,
      ville: row.ville,
    });

    return result;
  }

  private parse_acteur_API(acteur: ActeurLVAO_API): ActeurLVAO {
    const result = new ActeurLVAO({
      acheter: acteur.acheter.map((e) => ObjetLVAO[e]),
      adresse: acteur.adresse,
      code_postal: acteur.code_postal,
      complement_adresse: acteur.complement_adresse,
      date_derniere_maj: new Date(acteur.date_derniere_maj),
      description: acteur.description,
      detail_services: acteur.detail_services,
      donner: acteur.donner.map((e) => ObjetLVAO[e]),
      echanger: acteur.echanger.map((e) => ObjetLVAO[e]),
      emprunter: acteur.emprunter.map((e) => ObjetLVAO[e]),
      id: acteur.id,
      labels: acteur.labels.map((e) => LabelLVAO[e]),
      latitude: acteur.latitude,
      longitude: acteur.longitude,
      louer: acteur.louer.map((e) => ObjetLVAO[e]),
      mettreenlocation: acteur.mettreenlocation.map((e) => ObjetLVAO[e]),
      nom: acteur.nom,
      nom_commercial: acteur.nom_commercial,
      preter: acteur.preter.map((e) => ObjetLVAO[e]),
      reparer: acteur.reparer.map((e) => ObjetLVAO[e]),
      reprise: acteur.reprise,
      reprise_exclusif: acteur.reprise_exclusif,
      revendre: acteur.revendre.map((e) => ObjetLVAO[e]),
      siren: acteur.siren,
      siret: acteur.siret,
      sources: acteur.sources.map((e) => SourceLVAO[e]),
      sur_rdv: acteur.sur_rdv,
      telephone: acteur.telephone,
      trier: acteur.trier.map((e) => ObjetLVAO[e]),
      type_acteur: TypeActeurLVAO[acteur.type_acteur],
      type_public: PublicLVAO[acteur.type_public],
      types_service: acteur.types_service.map((e) => TypeServiceLVAO[e]),
      url: acteur.url,
      ville: acteur.ville,
    });

    return result;
  }

  private parsePropDeService(props: string): InnerActionLVAO[] {
    return JSON.parse(props) as InnerActionLVAO[];
  }

  private splitOrEmptyArray(data: string): string[] {
    if (data.indexOf('|') > -1) {
      return data.split('|');
    }
    if (data.length > 0) {
      return [data];
    }
    return [];
  }
}
