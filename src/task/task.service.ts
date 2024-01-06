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
import { UpdateTaskDTO } from './DTO/updateTask.dto';

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
      throw new BadRequestException(
        `query task id :${taskId} fail, error ${error}`,
      );
    }
  }

  async updateTaskById(
    updateTaskDTO: UpdateTaskDTO,
    taskId: string,
    user: User,
  ) {
    const { title, description } = updateTaskDTO;
    try {
      const updateTask = await this.getTaskById(taskId);
      if (title) updateTask.title = title;
      if (description) updateTask.description = description;
      updateTask.save();
      return updateTask;
    } catch (error) {
      throw new BadRequestException(
        `update task id:${taskId} fail, error ${error}`,
      );
    }
  }

  async deleteTaskById(taskId: string) {
    try {
      const res = await this.taskModule
        .deleteOne({
          _id: taskId,
        })
        .exec();
      if (res.deletedCount === 0) {
        throw new BadRequestException(`delete taskId ${taskId}fail`);
      }
      return {
        msg: `delete taskId ${taskId} successful`,
      };
    } catch (error) {
      throw new BadRequestException(`delete operation fail error ${error}`);
    }
  }
}
