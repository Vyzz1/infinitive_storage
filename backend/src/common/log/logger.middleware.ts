import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { type Request } from 'express';
import os from 'os';
import { Observable } from 'rxjs';
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const { ip, method, originalUrl } = req;
    const hostname =
      process.env.HOSTNAME || process.env.INSTANCE_NAME || os.hostname();

    this.logger.log(
      `Request ::: -> Host: ${hostname} - ${method} ${originalUrl} - IP: ${ip}`,
    );

    return next.handle();
  }
}
