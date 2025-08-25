import { Prisma } from '@prisma/client';
import { ActionLVAO } from '../../../src/domain/lvao/action_LVAO';
import { LabelLVAO } from '../../../src/domain/lvao/label_LVAO';
import { ObjetLVAO } from '../../../src/domain/lvao/objet_LVAO';
import { PublicLVAO } from '../../../src/domain/lvao/public_LVAO';
import { SourceLVAO } from '../../../src/domain/lvao/source_LVAO';
import { TypeActeurLVAO } from '../../../src/domain/lvao/typeActeur_LVAO';
import { TypeServiceLVAO } from '../../../src/domain/lvao/typeService_LVAO';
import { LVAORepository } from '../../../src/infrastructure/repository/lvao.repository';
import { LVAOInternalAPIClient } from '../../../src/infrastructure/repository/lvaoInternalAPIClient';
import { LVAOUsecase } from '../../../src/usecase/lvao.usecase';
import { TestUtil } from '../../TestUtil';

const lvao_repository = new LVAORepository(TestUtil.prisma);
const lvao_api_client = new LVAOInternalAPIClient();
const lvao_usecase = new LVAOUsecase(lvao_repository, lvao_api_client);

describe('LVAO Usecase', () => {
  beforeAll(async () => {
    await TestUtil.appinit();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestUtil.deleteAll();
  });

  afterAll(async () => {
    await TestUtil.appclose();
  });

  it('Upserts from API OK', async () => {
    // GIVEN
    await TestUtil.prisma.acteurLVAO.deleteMany();

    // WHEN
    await lvao_usecase.upsert_acteur({
      acheter: [ObjetLVAO.Bateau],
      adresse: 'adresse',
      code_postal: '12345',
      complement_adresse: 'haha',
      date_derniere_maj: new Date(123),
      description: 'beaux beateaux',
      detail_services: [
        { action: ActionLVAO.echanger, sous_categories: [ObjetLVAO.Bateau] },
      ],
      donner: [ObjetLVAO['Autres PMCB']],
      echanger: [ObjetLVAO.velo],
      emprunter: [ObjetLVAO['Déchets de produits chimiques acides']],
      id: '1234567',
      labels: [LabelLVAO.ecomaison],
      latitude: 40,
      longitude: 2,
      louer: [ObjetLVAO.puericulture],
      mettreenlocation: [ObjetLVAO.palette],
      nom: 'nom',
      nom_commercial: 'nom_commercial',
      preter: [ObjetLVAO.papiers_graphiques],
      reparer: [ObjetLVAO.vaisselle],
      reprise: 'reprise',
      reprise_exclusif: true,
      revendre: [ObjetLVAO['smartphone, tablette et console']],
      siren: 'siren',
      siret: 'siret',
      sources: [SourceLVAO['ADEME - SINOE']],
      sur_rdv: true,
      telephone: '0612345678',
      trier: [ObjetLVAO['CD, DVD et jeu video']],
      type_acteur: TypeActeurLVAO.artisan,
      type_public: PublicLVAO.Particuliers,
      types_service: [TypeServiceLVAO.achat_revente_professionnel],
      url: 'url',
      ville: 'ville',
    });

    // THEN
    const db = await TestUtil.prisma.acteurLVAO.findMany();

    expect(db).toHaveLength(1);
    const entry = db[0];
    delete entry.updated_at;
    delete entry.created_at;

    expect(entry).toEqual({
      acheter: ['Bateau'],
      adresse: 'adresse',
      code_postal: '12345',
      complement_adresse: 'haha',
      date_derniere_maj: new Date(123),
      description: 'beaux beateaux',
      detail_services: [
        {
          action: 'echanger',
          sous_categories: [ObjetLVAO.Bateau],
        },
      ],
      donner: ['Autres PMCB'],
      echanger: ['velo'],
      emprunter: ['Déchets de produits chimiques acides'],
      id: '1234567',
      labels: ['ecomaison'],
      latitude: new Prisma.Decimal(40),
      longitude: new Prisma.Decimal(2),
      louer: ['puericulture'],
      mettreenlocation: ['palette'],
      nom: 'nom',
      nom_commercial: 'nom_commercial',
      preter: ['papiers_graphiques'],
      reparer: ['vaisselle'],
      reprise: 'reprise',
      reprise_exclusif: true,
      revendre: ['smartphone, tablette et console'],
      siren: 'siren',
      siret: 'siret',
      sources: ['ADEME - SINOE'],
      sur_rdv: true,
      telephone: '0612345678',
      trier: ['CD, DVD et jeu video'],
      type_acteur: 'artisan',
      type_public: 'Particuliers',
      types_service: ['achat_revente_professionnel'],
      url: 'url',
      ville: 'ville',
    });
  });

  it.skip('Upserts from CSV file OK', async () => {
    // GIVEN
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const file_name = 'acteurs_extract.csv';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    // WHEN
    await lvao_usecase.smart_load_csv_lvao_file(__dirname + '/' + file_name);
    await delay(1000); // FIXME ^^

    // THEN
    const db = await TestUtil.prisma.acteurLVAO.findMany();

    expect(db).toHaveLength(3);
    let entry;
    for (const elem of db) {
      if (elem.adresse === '1 Chemin des Meuniers') {
        entry = elem;
      }
    }
    delete entry.updated_at;
    delete entry.created_at;

    expect(entry).toEqual({
      acheter: [],
      adresse: '1 Chemin des Meuniers',
      code_postal: '17400',
      complement_adresse: '',
      date_derniere_maj: new Date('2025-01-13'),
      description: '',
      detail_services: [
        {
          action: 'trier',
          sous_categories: ['emballage_verre'],
        },
      ],
      donner: [],
      echanger: [],
      emprunter: [],
      id: '222xK6YdoHvVNxBzc6L2VM',
      labels: [],
      latitude: new Prisma.Decimal(45.926685),
      longitude: new Prisma.Decimal(-0.49741),
      louer: [],
      mettreenlocation: [],
      nom: 'CYCLAD: Point de collecte',
      nom_commercial: '',
      preter: [],
      reparer: [],
      reprise: '',
      reprise_exclusif: true,
      revendre: [],
      siren: '251701900',
      siret: '',
      sources: ['Longue Vie Aux Objets', 'ADEME', 'CITEO'],
      sur_rdv: true,
      telephone: '',
      trier: ['emballage_verre'],
      type_acteur: 'pav_public',
      type_public: 'Particuliers',
      types_service: ['structure_de_collecte'],
      url: '',
      ville: "Saint-Julien-De-L'Escap",
    });
  });
});
