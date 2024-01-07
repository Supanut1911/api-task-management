import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../auth/model/user.model';
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

  async createTask(userId: string, createTaskDTO: CreateTaskDTO) {
    const { title, description } = createTaskDTO;
    const newTask = new this.taskModel({
      title,
      description,
      creator: userId,
    });

    const createdTask = await this.taskModel.create(newTask);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          tasks: createdTask,
        },
      },
      { new: true },
    );
    return {
      taskId: createdTask._id,
    };
  }
  catch(error) {
    throw new BadRequestException(`create task fail, error ${error}`);
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
    userId: string,
  ) {
    const { title, description } = updateTaskDTO;
    const updateFields = {};
    if (title) updateFields['title'] = title;
    if (description) updateFields['description'] = description;

    try {
      const taskFoundAndUpdate = await this.taskModel.findOneAndUpdate(
        { _id: taskId, creator: userId },
        updateFields,
        { new: true },
      );

      if (!taskFoundAndUpdate) {
        throw new NotFoundException(
          `can't update task because it not your task`,
        );
      }
      return taskFoundAndUpdate;
    } catch (error) {
      throw new BadRequestException(`Update task not successful`);
    }
  }

  async deleteTaskById(taskId: string, userId: string) {
    try {
      const task = await this.taskModel.findOne({
        _id: taskId,
        creator: userId,
      });

      if (!task) {
        throw new NotFoundException(
          `can't delete task because it not your task`,
        );
      }

      const res = await this.taskModel.deleteOne({
        _id: taskId,
      });

      if (res.deletedCount === 0) {
        throw new BadRequestException(`delete taskId ${taskId}fail`);
      }

      return {
        msg: `delete taskId ${taskId} successful`,
      };
    } catch (error) {
      throw new BadRequestException(`Delete task not successful`);
    }
  }

  async updateTaskStatus(taskId, userId: string) {
    try {
      const taskFound = await this.taskModel.findOneAndUpdate(
        { _id: taskId, creator: userId },
        { isActive: false },
        { new: true },
      );
      return taskFound;
    } catch (error) {
      throw new BadRequestException(`Update task status not successful`);
    }
  }
}
