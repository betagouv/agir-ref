import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { App } from '../../domain/app';
import { ActeurLVAO } from '../../domain/lvao/acteur_LVAO';
import { ActeurLVAO_API } from '../api/types/ActeurLVAOAPI';

@Injectable()
export class LVAOInternalAPIClient {
  constructor() {}

  async put_acteur(acteur: ActeurLVAO): Promise<void> {
    const payload: ActeurLVAO_API = {
      id: acteur.id,
      donner: acteur.donner,
      code_postal: acteur.code_postal,
      complement_adresse: acteur.complement_adresse,
      date_derniere_maj: acteur.date_derniere_maj,
      description: acteur.description,
      detail_services: acteur.detail_services,
      echanger: acteur.echanger,
      emprunter: acteur.emprunter,
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
      type_public: acteur.type_public,
      types_service: acteur.types_service,
      acheter: acteur.acheter,
      adresse: acteur.adresse,
      url: acteur.url,
      ville: acteur.ville,
    };
    try {
      await axios.put(App.getActeurAPIURL(), payload, {
        timeout: 1000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${App.getCronAPIKey()}`,
        },
      });
      console.log('OK');
    } catch (error) {
      console.log(error);
    }
  }
}
