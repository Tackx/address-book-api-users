export abstract class LogConfig {
  public static params = {
    path: '../../logs',
    fileName: 'access.log',
    size: '10M',
    interval: '1d', // rotate once per day
    compress: 'gzip'
  };
}

export abstract class JwtConfig {
  public static params = {
    duration: '2h',
    encryptAlgorithm: 'RS256',
    decryptAlgorithms: ['RS256']
  };
}
