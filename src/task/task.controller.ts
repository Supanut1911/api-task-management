import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTO/createTask.dto';
import { GetUser } from 'src/utils/get-user.decorator';
import { User } from 'src/user/model/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateTaskDTO } from './DTO/updateTask.dto';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ) {
    return await this.taskService.createTask(user, createTaskDTO);
  }

  @Get()
  async getAllTasksByUserId(@GetUser() user: User) {
    return await this.taskService.getAllTasksByUserId(user);
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    return await this.taskService.getTaskById(taskId);
  }

  @Patch(':taskId')
  async updateTaskById(
    @Param('taskId') taskId: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ) {
    return await this.taskService.updateTaskById(updateTaskDTO, taskId);
  }
}
