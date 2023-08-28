import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './student.entity';
import { CreateStudentInput } from './student.input';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  getStudents(): Promise<Student[]> {
    const students = this.studentRepository.find();

    return students;
  }

  getStudent(id: string): Promise<Student> {
    const student = this.studentRepository.findOneBy({ id });

    return student;
  }

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

  async getManyStudents(studentIds: string[]): Promise<Student[]> {
    const findId: any = { $in: studentIds };

    return this.studentRepository.find({
      where: {
        id: findId,
      },
    });
  }
}
