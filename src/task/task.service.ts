import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/auth/model/user.model';
import { Task } from './model/tasks.model';
import { Model } from 'mongoose';
import { CreateTaskDTO } from './DTO/createTask.dto';
import { UpdateTaskDTO } from './DTO/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task')
    private readonly taskModel: Model<Task>,

    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async createTask(user: User, createTaskDTO: CreateTaskDTO) {
    const { title, description } = createTaskDTO;
    const newTask = new this.taskModel({
      title,
      description,
      user: user.id,
    });

    const task = await newTask.save();
    const existUser = await this.userModel.findById(user.id);
    existUser.tasks = [...existUser.tasks, task];
    existUser.save();
    return task;
  }

  async getAllTasks(pageSize: number, page: number) {
    try {
      const countOngoingTasks = await this.taskModel
        .find({ isActive: true })
        .countDocuments();

      const countDoneTasks = await this.taskModel
        .find({ isActive: false })
        .countDocuments();
      if (pageSize && page) {
        console.log(pageSize, page);

        const tasks = await this.taskModel
          .find()
          .skip(pageSize * (page - 1))
          .limit(pageSize);
        return {
          msg: 'fetch success',
          tasks,
          countOngoingTasks,
          countDoneTasks,
        };
      } else {
        const tasks = await this.taskModel.find();

        return {
          tasks,
          countOngoingTasks,
          countDoneTasks,
        };
      }
    } catch (error) {
      throw new BadRequestException(`query task fail, error ${error}`);
    }
  }

  async getTaskById(taskId: string) {
    try {
      const task = await this.taskModel.findById(taskId);
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
      const res = await this.taskModel
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
