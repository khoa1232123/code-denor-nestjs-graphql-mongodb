import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './student.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  createStudent(createStudentInput: CreateStudentInput): Promise<Student> {
    const { firstName, lastName, email, password } = createStudentInput;

    const student = this.studentRepository.create({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password,
    });

    return this.studentRepository.save(student);
  }
}
