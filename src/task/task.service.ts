import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/model/user.model';
import { Task } from './model/tasks.model';
import mongoose, { Model } from 'mongoose';
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

  async getAllTasksByUserId(user: User) {
    const stringId = user.id;
    const query = { user: new mongoose.Types.ObjectId(stringId) };

    try {
      const tasks = await this.taskModule.find(query);
      return tasks;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getTaskById(taskId: string) {
    try {
      const task = await this.taskModule.findById(taskId);
      if (!task) {
        throw new NotFoundException(`not found task id:${taskId}`);
      }
      return task;
    } catch (error) {
      throw new BadRequestException(`query task id :${taskId} fail`);
    }
  }
}
