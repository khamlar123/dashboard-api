import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './Interceptors/response.interceptor';
import { HttpExceptionFilter } from './Interceptors/http-exception.filter';
//import { ValidationPipe } from './common/pipes/validation.pipe';
import { LoggingInterceptor } from './Interceptors/logging.interceptor';
import { logger } from './common/middleware/logger.middleware';
import { Logger } from '@nestjs/common';
import * as moment from 'moment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle(' API')
    .setDescription('Dashboard-api')
    .setVersion('1.0')
    .addTag('Dashboard-api')
    .setExternalDoc('Docs', 'docs-json')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000 , () => {
    Logger.log(
      `Running on port ${process.env.PORT ?? 3000}`
    );
  });
}
bootstrap();
