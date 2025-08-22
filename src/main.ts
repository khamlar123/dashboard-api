import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/Interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/Interceptors/http-exception.filter';
import { LoggingInterceptor } from './common/Interceptors/logging.interceptor';
import { Logger } from '@nestjs/common';
import { AuthSwagger } from './common/middleware/auth.swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
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
  app.use('/docs', new AuthSwagger().use);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(
  //   '/scalar',
  //   apiReference({
  //     content: document,
  //   }),
  // );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  // const port = process.env.PORT as string;
  // const host = process.env.HOST as any;
  //
  // await app.listen(parseInt(port), host);
  // const url = await app.getUrl(); // works now
  // Logger.log(`🚀 App running at ${url}`);

  await app.listen(process.env.PORT ?? 5004, () => {
    Logger.log(`Listening at http://localhost:${process.env.PORT}`);
  });
}

bootstrap();
