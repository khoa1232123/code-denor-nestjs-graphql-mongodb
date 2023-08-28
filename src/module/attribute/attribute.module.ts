import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './attribute.entity';
import { AttributeResolver } from './attribute.resolver';
import { AttributeService } from './attribute.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])],
  providers: [AttributeService, AttributeResolver],
  exports: [AttributeService],
})
export class AttributeModule {}
