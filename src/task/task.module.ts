import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './model/tasks.model';
import { UserSchema } from 'src/user/model/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Task',
        schema: TaskSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
