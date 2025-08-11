import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { TaskDto } from "./dto/task.dto";

@Controller("user/tasks")
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Auth()
	@Get()
	async getAll(@CurrentUser("id") userId: string) {
		return this.taskService.getAll(userId);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Post()
	async create(@CurrentUser("id") userId: string, @Body() dto: TaskDto) {
		return this.taskService.create(userId, dto);
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Auth()
	@HttpCode(200)
	@Put(":id")
	async update(
		@CurrentUser("id") userId: string,
		@Body() dto: TaskDto,
		@Param("id") id: string
	) {
		return this.taskService.update(userId, id, dto);
	}

	@Auth()
	@HttpCode(200)
	@Delete(":id")
	async delete(@Param("id") id: string) {
		return this.taskService.delete(id);
	}
}
