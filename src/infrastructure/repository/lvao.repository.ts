import { Injectable } from '@nestjs/common';
import { ActeurLVAO as ActeurLVAO_DB, Prisma } from '@prisma/client';
import { ActeurLVAO } from '../../domain/lvao/acteur_LVAO';
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
      latitude: acteur.latitude ? new Prisma.Decimal(acteur.latitude) : null,
      longitude: acteur.longitude ? new Prisma.Decimal(acteur.longitude) : null,
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
}
