import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptors';

@Module({
  imports: [PrismaModule, UserModule, PostModule],
  controllers: [AppController],
  providers: [
    AppService,
    PostService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
