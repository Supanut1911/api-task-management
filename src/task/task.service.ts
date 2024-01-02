import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/model/user.model';
import { Task } from './model/tasks.model';
import { Model } from 'mongoose';
import { CreateTaskDTO } from './DTO/createTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task')
    private readonly taskModule: Model<Task>,

    @InjectModel('User')
    private readonly userModule: Model<User>,
  ) {}

  async createTask(user: User, createTaskDTO: CreateTaskDTO) {
    const { title, description } = createTaskDTO;
    const newTask = new this.taskModule({
      title,
      description,
      user: user.id,
    });

    const task = await newTask.save();
    const existUser = await this.userModule.findById(user.id);
    existUser.tasks = [...existUser.tasks, task];
    existUser.save();
    return task;
  }
}
