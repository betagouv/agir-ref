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

    // WHEN
    const response = await TestUtil.POST(
      '/lvao/acteurs/recompute_geometry',
    ).set('Authorization', `Bearer 123`);

    // THEN
    expect(response.status).toEqual(201);
    expect(response.body.count).toEqual(1);
  });
});
