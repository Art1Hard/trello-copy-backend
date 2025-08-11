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
import { TimerService } from "./timer.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { TimerRoundDto, TimerSessionDto } from "./dto/timer.dto";

@Controller("user/timer")
export class TimerController {
	constructor(private readonly timerService: TimerService) {}

	@Auth()
	@Get()
	async getSession(@CurrentUser("id") userId: string) {
		const todaySession = await this.timerService.getTodaySession(userId);
		return todaySession ? todaySession : {};
	}

	@Auth()
	@HttpCode(200)
	@Post()
	async createSession(@CurrentUser("id") userId: string) {
		return this.timerService.create(userId);
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Auth()
	@HttpCode(200)
	@Put("round/:id")
	async updateRound(@Body() dto: TimerRoundDto, @Param("id") id: string) {
		return this.timerService.updateRound(dto, id);
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Auth()
	@HttpCode(200)
	@Put(":id")
	async updateSession(
		@Body() dto: TimerSessionDto,
		@CurrentUser("id") userId: string,
		@Param("id") id: string
	) {
		return this.timerService.update(dto, id, userId);
	}

	@Auth()
	@HttpCode(200)
	@Delete(":id")
	async deleteSession(
		@Param("id") id: string,
		@CurrentUser("id") userId: string
	) {
		return this.timerService.deleteSession(id, userId);
	}
}
