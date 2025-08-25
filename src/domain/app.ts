export class App {
  public static isProd(): boolean {
    return process.env.IS_PROD === 'true';
  }

  public static getCronAPIKey(): string {
    return process.env.CRON_API_KEY;
  }
  public static getActeurAPIURL(): string {
    return process.env.ACTEUR_API_URL;
  }
}
