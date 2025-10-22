export class AppConfigurationsDto {
  private port: number;
  private ip: string;
  private logLevel: string;
  private host: string;
  private userName: string;
  private password: string;
  private dataBase: string;
  private dataBasePort: number;
  private jwtSecret: string;
  private jwtExpireTime: string;
  private refreshSecret: string;
  private refreshExpireTime: string;

  public getPort(): number {
      return this.port;
  }

  public setPort(port: number): void {
      this.port = port;
  }

  public getIp(): string {
      return this.ip;
  }

  public setIp(ip: string): void {
      this.ip = ip;
  }

  public getLogLevel(): string {
      return this.logLevel;
  }

  public setLogLevel(logLevel: string): void {
      this.logLevel = logLevel;
  }

  public getHost(): string {
      return this.host;
  }

  public setHost(host: string): void {
      this.host = host;
  }

  public getUserName(): string {
      return this.userName;
  }

  public setUserName(userName: string): void {
      this.userName = userName;
  }

  public getPassword(): string {
      return this.password;
  }

  public setPassword(password: string): void {
      this.password = password;
  }

  public getDataBase(): string {
      return this.dataBase;
  }

  public setDataBase(dataBase: string): void {
      this.dataBase = dataBase;
  }

  public getDataBasePort(): number {
      return this.dataBasePort;
  }

  public setDataBasePort(dataBasePort: number): void {
      this.dataBasePort = dataBasePort;
  }

  public getJwtSecret(): string {
      return this.jwtSecret;
  }

  public setJwtSecret(jwtSecret: string): void {
      this.jwtSecret = jwtSecret;
  }

  public getJwtExpireTime(): string {
      return this.jwtExpireTime;
  }

  public setJwtExpireTime(jwtExpireTime: string): void {
      this.jwtExpireTime = jwtExpireTime;
  }

  public getRefreshSecret(): string {
      return this.refreshSecret;
  }

  public setRefreshSecret(refreshSecret: string): void {
      this.refreshSecret = refreshSecret;
  }

  public getRefreshExpireTime(): string {
      return this.refreshExpireTime;
  }

  public setRefreshExpireTime(refreshExpireTime: string): void {
      this.refreshExpireTime = refreshExpireTime;
  }

}
