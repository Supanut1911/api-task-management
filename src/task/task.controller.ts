import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTO/createTask.dto';
import { GetUser } from 'src/utils/get-user.decorator';
import { User } from 'src/auth/model/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateTaskDTO } from './DTO/updateTask.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ) {
    return await this.taskService.createTask(user, createTaskDTO);
  }

  @Get()
  async getAllTasks(@Request() req) {
    const { pageStart, page } = req.query;
    return await this.taskService.getAllTasks(pageStart, page);
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    return await this.taskService.getTaskById(taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':taskId')
  async updateTaskById(
    @Param('taskId') taskId: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @GetUser() user: User,
  ) {
    return await this.taskService.updateTaskById(updateTaskDTO, taskId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':taskId')
  async deleteTaskById(@Param('taskId') taskId: string) {
    return await this.taskService.deleteTaskById(taskId);
  }
}
