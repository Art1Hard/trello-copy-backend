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
import { TimeBlockService } from "./time-block.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { TimeBlockDto } from "./dto/time-block.dto";
import { UpdateOrderDto } from "./dto/update-oreder.dto";

@Controller("user/time-block")
export class TimeBlockController {
	constructor(private readonly timeBlockService: TimeBlockService) {}

	@Auth()
	@Get()
	async getAll(@CurrentUser("id") userId: string) {
		return this.timeBlockService.getAll(userId);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Post()
	async create(@CurrentUser("id") userId: string, @Body() dto: TimeBlockDto) {
		return this.timeBlockService.create(userId, dto);
	}

	@Auth()
	@HttpCode(200)
	@Put("update-order")
	async updateOrder(@Body() dto: UpdateOrderDto) {
		return this.timeBlockService.updateOrder(dto.ids);
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Auth()
	@HttpCode(200)
	@Put(":id")
	async update(
		@CurrentUser("id") userId: string,
		@Body() dto: TimeBlockDto,
		@Param("id") id: string
	) {
		return this.timeBlockService.update(userId, id, dto);
	}

	@Auth()
	@HttpCode(200)
	@Delete(":id")
	async delete(@Param("id") id: string) {
		return this.timeBlockService.delete(id);
	}
}
