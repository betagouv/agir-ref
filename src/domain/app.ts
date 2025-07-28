export class App {
  public static isProd(): boolean {
    return process.env.IS_PROD === 'true';
  }

  public static getCronAPIKey(): string {
    return process.env.CRON_API_KEY;
  }
}
