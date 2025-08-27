import { ActionLVAO } from '../../../src/domain/lvao/action_LVAO';
import { LabelLVAO } from '../../../src/domain/lvao/label_LVAO';
import { ObjetLVAO } from '../../../src/domain/lvao/objet_LVAO';
import { PublicLVAO } from '../../../src/domain/lvao/public_LVAO';
import { SourceLVAO } from '../../../src/domain/lvao/source_LVAO';
import { TypeActeurLVAO } from '../../../src/domain/lvao/typeActeur_LVAO';
import { TypeServiceLVAO } from '../../../src/domain/lvao/typeService_LVAO';
import { LVAORepository } from '../../../src/infrastructure/repository/lvao.repository';
import { LVAOUsecase } from '../../../src/usecase/lvao.usecase';
import { TestUtil } from '../../TestUtil';

const lvao_repository = new LVAORepository(TestUtil.prisma);
const lvao_usecase = new LVAOUsecase(lvao_repository);

const basic_data = {
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
  distance: undefined,
};

describe('Acteurs LVAO (API test)', () => {
  const OLD_ENV = process.env;

  beforeAll(async () => {
    await TestUtil.appinit();
  });

  beforeEach(async () => {
    process.env = { ...OLD_ENV }; // Make a copy
    await TestUtil.deleteAll();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await TestUtil.appclose();
  });

  it(`recompute_geometry `, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur(basic_data);

    // WHEN
    const response = await TestUtil.POST(
      '/lvao/acteurs/recompute_geometry',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(201);
    expect(response.body.count).toEqual(1);
  });

  it(`GET lvao/acteurs  : data correct`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur(basic_data);
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&limit=10',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toEqual({
      acheter: ['Bateau'],
      adresse: 'adresse',
      code_postal: '12345',
      complement_adresse: 'haha',
      date_derniere_maj: '1970-01-01T00:00:00.123Z',
      description: 'beaux beateaux',
      detail_services: [
        {
          action: 'echanger',
          sous_categories: ['Bateau'],
        },
      ],
      donner: ['Autres PMCB'],
      echanger: ['velo'],
      emprunter: ['Déchets de produits chimiques acides'],
      id: '1234567',
      labels: ['ecomaison'],
      latitude: 40,
      longitude: 2,
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
      distance_metres: 170357,
    });
  });

  it(`GET lvao/acteurs : tri correct`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&limit=10',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0].id).toEqual('1');
    expect(response.body[1].id).toEqual('2');
    expect(response.body[2].id).toEqual('3');
  });

  it(`GET lvao/acteurs : limit correcte`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&limit=1',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toEqual('1');
  });
  it(`GET lvao/acteurs : rayon correcte #1`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&rayon_metres=200000',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].id).toEqual('1');
  });
  it(`GET lvao/acteurs : rayon correcte #2`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&rayon_metres=111000',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toEqual('1');
  });
  it(`GET lvao/acteurs : filtre actions correcte`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
      acheter: [ObjetLVAO.Bateau],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
      acheter: [ObjetLVAO['CD, DVD et jeu video']],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
      donner: [ObjetLVAO.ampoule],
      acheter: [],
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&action=acheter',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(2);
  });

  it(`GET lvao/acteurs : filtre actions ET objet correcte`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
      acheter: [ObjetLVAO.Bateau],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
      acheter: [ObjetLVAO['CD, DVD et jeu video']],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
      acheter: [ObjetLVAO.Pneu],
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&action=acheter&objet=Pneu',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toEqual('3');
  });
  it(`GET lvao/acteurs : filtre objet seul correct`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
      acheter: [ObjetLVAO.medicaments],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
      louer: [ObjetLVAO.medicaments],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
      acheter: [ObjetLVAO.Pneu],
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&objet=medicaments',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(2);
  });

  it(`GET lvao/acteurs : filtre objet seul correct - no result`, async () => {
    // GIVEN
    process.env.CRON_API_KEY = '123';
    await TestUtil.prisma.acteurLVAO.deleteMany();

    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '1',
      longitude: 0,
      latitude: 40,
      acheter: [ObjetLVAO.medicaments],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '2',
      longitude: 0,
      latitude: 41,
      louer: [ObjetLVAO.medicaments],
    });
    await lvao_usecase.upsert_acteur({
      ...basic_data,
      id: '3',
      longitude: 0,
      latitude: 42,
      acheter: [ObjetLVAO.Pneu],
    });
    await lvao_usecase.recompute_geometry();

    // WHEN
    const response = await TestUtil.GET(
      '/lvao/acteurs?latitude=40&longitude=0&objet=jouet',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(0);
  });
});
