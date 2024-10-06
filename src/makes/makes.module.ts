import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MakesService } from './makes.service';
import { MakesResolver } from './makes.resolver';
import { MakeSchema } from './make.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Make', schema: MakeSchema }]),
    HttpModule,
  ],
  providers: [MakesService, MakesResolver],
})
export class MakesModule {}
