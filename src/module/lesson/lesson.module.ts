import { Module } from '@nestjs/common';
import { LessonResolver } from './lesson.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { LessonService } from './lesson.service';
import { StudentModule } from 'src/module/student/student.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), StudentModule],
  providers: [LessonResolver, LessonService],
})
export class LessonModule {}
