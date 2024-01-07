import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Task } from './model/tasks.model';
import { User } from 'src/auth/model/user.model';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskModel: Model<Task>;
  let userModel: Model<User>;

  const mockTaskService = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: mockTaskService,
        },
        {
          provide: getModelToken('User'),
          useValue: mockUserService,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskModel = module.get(getModelToken('Task'));
    userModel = module.get(getModelToken('User'));
  });

  it('should create a task', async () => {
    const createTaskDTO = {
      title: 'doing 1',
      description: 'descp doing 1',
    };

    const mockUserId = '659564f934ad33a4db5d5f7f';

    const mockTask = {
      _id: '659573b4e7b14ea58c7d35e7',
      title: 'task title',
      description: 'task description',
      creator: '659564f934ad33a4db5d5f7f',
    };

    const mockUser = {
      _id: '659564f934ad33a4db5d5f7f',
      username: 'alice',
      password: 'hashpassword',
      tasks: [],
    };

    jest
      .spyOn(taskModel, 'create' as any)
      .mockImplementationOnce(() => Promise.resolve(mockTask));

    jest.spyOn(userModel, 'findById' as any).mockResolvedValueOnce(mockUser);

    jest
      .spyOn(userModel, 'findByIdAndUpdate' as any)
      .mockResolvedValueOnce(mockUser);

    const result = await taskService.createTask(mockUserId, createTaskDTO);
    expect(result.taskId).toEqual(mockTask._id);
    expect(taskModel.create).toHaveBeenCalledTimes(1);
  });

  it('should throw BadRequestException when create task failed', async () => {
    const mockUserId = '659564f934ad33a4db5d5f7f';

    const createTaskDTO = {
      title: 'doing 1',
      description: 'descp doing 1',
    };

    jest.spyOn(taskModel, 'create' as any).mockRejectedValueOnce('error');
    expect(taskService.createTask(mockUserId, createTaskDTO)).rejects.toThrow(
      'create task fail, error error',
    );
  });

  // it('should getAllTasksByUserId', async () => {
  //   const mockTask = {
  //     _id: '659573b4e7b14ea58c7d35e7',
  //     title: 'task title',
  //     description: 'task description',
  //     creator: '659573b4e7b14ea58c7d35e7',
  //   };

  //   const mockUserId = '659564f934ad33a4db5d5f7f';

  //   const mockTasks = [mockTask];

  //   jest.spyOn(taskModel, 'find').mockResolvedValueOnce(mockTasks);

  //   const result = await taskService.getAllTasksByUserId(mockUserId);
  //   expect(result).toEqual(mockTasks);
  //   expect(taskModel.find).toHaveBeenCalledTimes(1);
  // });

  // it('should throw BadRequestException when getAllTasksByUserId failed', async () => {
  //   const mockUserId = '659564f934ad33a4db5d5f7f';

  //   jest.spyOn(taskModel, 'find' as any).mockRejectedValueOnce('error');
  //   expect(taskService.getAllTasksByUserId(mockUserId)).rejects.toThrow(
  //     'query task fail, error error',
  //   );
  // });

  // it('should getAllTasks', async () => {
  //   const mockPageSize = 10;
  //   const mockPage = 1;
  //   const mockCountOngoingTasks = 10;
  //   const mockCountDoneTasks = 10;

  //   const mockTask = {
  //     _id: '659573b4e7b14ea58c7d35e7',
  //     title: 'task title',
  //     description: 'task description',
  //     creator: '659573b4e7b14ea58c7d35e7',
  //     isActive: true,
  //     __v: 0,
  //   };
  //   const mockRespose = {
  //     tasks: mockTask,
  //     countOngoingTasks: mockCountOngoingTasks,
  //     countDoneTasks: mockCountDoneTasks,
  //   };
  //   const result = await taskService.getAllTasks(mockPageSize, mockPage);
  //   expect(result).toEqual(mockRespose);
  // });

  it('should getTaskById', async () => {
    const mockUserId = '659564f934ad33a4db5d5f7f';

    const mockTask = {
      _id: '659573b4e7b14ea58c7d35e7',
      title: 'task title',
      description: 'task description',
      creator: '659573b4e7b14ea58c7d35e7',
    };

    jest.spyOn(taskModel, 'findById').mockResolvedValueOnce(mockTask);

    expect(taskService.getTaskById(mockUserId)).resolves.toEqual(mockTask);
  });

  it('should throw BadRequestException when getTaskById failed', async () => {
    const mockUserId = '659564f934ad33a4db5d5f7f';

    jest.spyOn(taskModel, 'findById' as any).mockRejectedValueOnce('error');
    expect(taskService.getTaskById(mockUserId)).rejects.toThrow(
      'query task id :659564f934ad33a4db5d5f7f fail, error error',
    );
  });

  it('should updateTaskById', async () => {
    const mockTaskId = '659573b4e7b14ea58c7d35e7';
    const mockUserId = '659564f934ad33a4db5d5f7f';

    const mockTask = {
      _id: '659573b4e7b14ea58c7d35e7',
      title: 'task title',
      description: 'task description',
      creator: '659564f934ad33a4db5d5f7f',
    };

    const mockTaskUpdate = {
      _id: '659573b4e7b14ea58c7d35e7',
      title: 'task title update',
      description: 'task description update',
      creator: '659564f934ad33a4db5d5f7f',
    };

    const mockUpdateTaskDTO = {
      title: 'task title update',
      description: 'task description update',
    };

    jest
      .spyOn(taskModel, 'findOneAndUpdate' as any)
      .mockResolvedValueOnce(mockTaskUpdate);

    const result = await taskService.updateTaskById(
      mockUpdateTaskDTO,
      mockTaskId,
      mockUserId,
    );

    expect(result).toEqual(mockTaskUpdate);

    //date date task -> need != current task
    expect(result).not.toEqual(mockTask);
  });

  //case update task fail -> cacth

  it('should deleteTaskById', async () => {
    const mockTaskId = '659573b4e7b14ea58c7d35e7';
    const mockUserId = '659564f934ad33a4db5d5f7f';

    const mockTask = {
      _id: '659573b4e7b14ea58c7d35e7',
      title: 'task title',
      description: 'task description',
      creator: '659564f934ad33a4db5d5f7f',
    };

    const deleteResult = {
      msg: `delete taskId 659573b4e7b14ea58c7d35e7 successful`,
    };

    jest.spyOn(taskModel, 'findOne' as any).mockResolvedValueOnce(mockTask);

    jest.spyOn(taskModel, 'deleteOne' as any).mockResolvedValueOnce({
      msg: `delete taskId 659573b4e7b14ea58c7d35e7 successful`,
    });

    const result = await taskService.deleteTaskById(mockTaskId, mockUserId);

    expect(result).toEqual(deleteResult);
  });
});
