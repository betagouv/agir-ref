import { Injectable } from '@nestjs/common';
import { ActeurLVAO as ActeurLVAO_DB, Prisma } from '@prisma/client';
import { ActeurLVAO } from '../../domain/lvao/acteur_LVAO';
import { ActionLVAO } from '../../domain/lvao/action_LVAO';
import { LabelLVAO } from '../../domain/lvao/label_LVAO';
import { ObjetLVAO } from '../../domain/lvao/objet_LVAO';
import { PublicLVAO } from '../../domain/lvao/public_LVAO';
import { SourceLVAO } from '../../domain/lvao/source_LVAO';
import { TypeActeurLVAO } from '../../domain/lvao/typeActeur_LVAO';
import { TypeServiceLVAO } from '../../domain/lvao/typeService_LVAO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LVAORepository {
  constructor(private prisma: PrismaService) {}

  async upsert_acteur(acteur: ActeurLVAO): Promise<void> {
    const data: ActeurLVAO_DB = {
      id: acteur.id,
      acheter: acteur.acheter,
      adresse: acteur.adresse,
      code_postal: acteur.code_postal,
      complement_adresse: acteur.complement_adresse,
      date_derniere_maj: acteur.date_derniere_maj,
      description: acteur.description,
      detail_services: acteur.detail_services as any,
      donner: acteur.donner,
      echanger: acteur.echanger,
      emprunter: acteur.emprunter,
      labels: acteur.labels,
      latitude:
        acteur.latitude || acteur.latitude === 0
          ? new Prisma.Decimal(acteur.latitude)
          : null,
      longitude:
        acteur.longitude || acteur.longitude === 0
          ? new Prisma.Decimal(acteur.longitude)
          : null,
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
      url: acteur.url,
      ville: acteur.ville,
      created_at: undefined,
      updated_at: undefined,
    };

    await this.prisma.acteurLVAO.upsert({
      where: {
        id: data.id,
      },
      create: data,
      update: data,
    });
  }

  public async countAll(): Promise<number> {
    return await this.prisma.acteurLVAO.count();
  }

  public async updateAllGeom(): Promise<number> {
    const result = await this.prisma.$executeRawUnsafe(
      `UPDATE "ActeurLVAO" SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);`,
    );
    return result;
  }

  public async selectByDistanceFrom(
    longitude: number,
    latitude: number,
    limit: number,
  ): Promise<ActeurLVAO[]> {
    const fields = [
      `acheter`,
      `adresse`,
      `code_postal`,
      `complement_adresse`,
      `date_derniere_maj`,
      `description`,
      `detail_services`,
      `donner`,
      `echanger`,
      `emprunter`,
      `id`,
      `labels`,
      `latitude`,
      `longitude`,
      `louer`,
      `mettreenlocation`,
      `nom`,
      `nom_commercial`,
      `preter`,
      `reparer`,
      `reprise`,
      `reprise_exclusif`,
      `revendre`,
      `siren`,
      `siret`,
      `sources`,
      `sur_rdv`,
      `telephone`,
      `trier`,
      `type_acteur`,
      `ville`,
      `url`,
      `type_public`,
      `types_service`,
    ];

    const result = await this.prisma.$queryRawUnsafe(
      `SELECT ${fields.join(
        ',',
      )} , round(ST_DistanceSphere(ST_SetSRID(ST_MakePoint(${longitude}, ${latitude} ),4326), geom)) AS distance_metre FROM "ActeurLVAO" ORDER BY distance_metre ASC LIMIT ${limit};`,
    );
    return (result as ActeurLVAO_DB[]).map((u) => this.mapDBToDomain(u));
  }

  private mapDBToDomain(db: ActeurLVAO_DB): ActeurLVAO {
    return {
      acheter: db.acheter.map((e) => ObjetLVAO[e]),
      adresse: db.adresse,
      code_postal: db.code_postal,
      complement_adresse: db.complement_adresse,
      date_derniere_maj: db.date_derniere_maj,
      description: db.description,
      detail_services: (db.detail_services as []).map((e) => ({
        action: ActionLVAO[e['action']],
        sous_categories: (e['sous_categories'] as []).map((e) => ObjetLVAO[e]),
      })),
      donner: db.donner.map((e) => ObjetLVAO[e]),
      echanger: db.echanger.map((e) => ObjetLVAO[e]),
      emprunter: db.emprunter.map((e) => ObjetLVAO[e]),
      id: db.id,
      labels: db.labels.map((e) => LabelLVAO[e]),
      latitude: db.latitude.toNumber(),
      longitude: db.longitude.toNumber(),
      louer: db.louer.map((e) => ObjetLVAO[e]),
      mettreenlocation: db.mettreenlocation.map((e) => ObjetLVAO[e]),
      nom: db.nom,
      nom_commercial: db.nom_commercial,
      preter: db.preter.map((e) => ObjetLVAO[e]),
      reparer: db.reparer.map((e) => ObjetLVAO[e]),
      reprise: db.reprise,
      reprise_exclusif: db.reprise_exclusif,
      revendre: db.revendre.map((e) => ObjetLVAO[e]),
      siren: db.siren,
      siret: db.siret,
      sources: db.sources.map((e) => SourceLVAO[e]),
      sur_rdv: db.sur_rdv,
      telephone: db.telephone,
      trier: db.trier.map((e) => ObjetLVAO[e]),
      type_acteur: TypeActeurLVAO[db.type_acteur],
      ville: db.ville,
      url: db.url,
      type_public: PublicLVAO[db.type_public],
      types_service: db.types_service.map((e) => TypeServiceLVAO[e]),
      distance_metres: db['distance_metre'],
    };
  }
}
