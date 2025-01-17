import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlingTargetEntity } from './crawlingTarget/entities/crawlingTarget.entity';
import { CrwalingTargetModule } from './crawlingTarget/crawlingTarget.module';
import { GptLog } from './log-module/entities/gpt-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').default('dev'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        DATABASE_IS_SSL: Joi.number().required(),
        DATABASE_NO_USE_CA: Joi.number().required(),
        GPT_AD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
      logging: false,
      ...(process.env.DATABASE_IS_SSL === '1' && {
        ssl: { rejectUnauthorized: process.env.DATABASE_NO_USE_CA === '1' },
      }),
      entities: [CrawlingTargetEntity, GptLog],
    }),
    HelloModule,
    UsersModule,
    CrwalingTargetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
