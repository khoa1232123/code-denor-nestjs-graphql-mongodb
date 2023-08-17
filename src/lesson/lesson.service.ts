import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { ObjectId, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
  ) {}

  async createLesson(name, startDate, endDate): Promise<Lesson> {
    const lesson = this.lessonRepository.create({
      id: uuidv4(),
      name,
      endDate,
      startDate,
    });

    return this.lessonRepository.save(lesson);
  }

  async getLesson(id: string): Promise<Lesson> {
    const lesson = this.lessonRepository.findOne({
      where: {
        id: id,
      },
    });

    return lesson;
  }

  async getLessons(): Promise<Lesson[]> {
    const lessons = this.lessonRepository.find();

    return lessons;
  }
}
