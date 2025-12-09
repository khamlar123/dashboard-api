import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/Interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/Interceptors/http-exception.filter';
import { LoggingInterceptor } from './common/Interceptors/logging.interceptor';
import { Logger } from '@nestjs/common';
import { AuthSwagger } from './common/middleware/auth.swagger';
import { ValidationPipe } from './common/pipes/validation.pipe';

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
  app.enableCors({
    origin:
      process.env.NODE_ENV !== 'production'
        ? true
        : 'http://report.apb.com.local:5000',
  });
  app.use('/docs', new AuthSwagger().use);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT as string;

  await app.listen(parseInt(port), () => {
    const server = app.getHttpServer();
    const address = server.address();
    const host =
      address.address === '::' || address.address === '0.0.0.0'
        ? process.env.HOST // 👈 replace with ENV or auto-detect
        : address.address;

    Logger.log(`Listening at http://${host}/api`);
    Logger.log(`Swagger UI: http://${host}/docs`);
  });
}

bootstrap();
