import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTO/createTask.dto';
import { GetUser } from 'src/utils/get-user.decorator';
import { User } from 'src/user/model/user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
}
