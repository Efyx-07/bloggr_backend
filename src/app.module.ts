import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { ArticleEntity } from './entities/article.entity';
import { AdminsModule } from './admins/admins.module';
import { AdminEntity } from './entities/admin.entity';
import { AuthModule } from './auth/auth.module';
import { PasswordsModule } from './passwords/passwords.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOSTNAME'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [ArticleEntity, AdminEntity],
        synchronize: true, // disable in production
      }),
    }),
    ArticlesModule,
    AdminsModule,
    AuthModule,
    PasswordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
