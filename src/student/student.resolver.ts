import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { StudentType } from './student.type';
import { CreateStudentInput } from './student.input';

@Resolver((of) => StudentType)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Mutation((returns) => StudentType)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    return this.studentService.createStudent(createStudentInput);
  }
}
