import morgan from 'morgan';
import { LogConfig } from '../config';
import { createStream } from 'rotating-file-stream';
import path from 'path';

const config = LogConfig.params;

const accessLogStream = createStream(config.fileName, {
  interval: config.interval,
  size: config.size,
  compress: config.compress,
  path: path.join(__dirname, config.path)
});

export default function logger(env: string) {
  if (env === 'file') {
    return morgan('common', { stream: accessLogStream });
  }
  if (env === 'console') {
    return morgan('common');
  }
  return morgan('dev');
}
