import { BadRequestException, Injectable } from "@nestjs/common";
import { hash } from "argon2";
import { AuthDto } from "src/auth/dto/auth.dto";
import { PrismaService } from "src/services/prisma.service";
import { UserDto } from "./dto/user.dto";
import { TaskService } from "src/task/task.service";

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private taskService: TaskService
	) {}

	getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				tasks: true,
			},
		});
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email,
			},
		});
	}

	async getProfile(id: string) {
		const profile = await this.getById(id);

		if (!profile) throw new BadRequestException("User not found");

		const totalTasks = profile.tasks.length;
		const completedTasks = await this.taskService.getCompletedTaskCount(id);
		const todayTasks = await this.taskService.getTaskCountForPeriod(id);
		const weekTasks = await this.taskService.getTaskCountForPeriod(id, "week");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = profile;

		return {
			user,
			statistics: [
				{ label: "Total", value: totalTasks },
				{ label: "Completed tasks", value: completedTasks },
				{ label: "Today tasks", value: todayTasks },
				{ label: "Week tasks", value: weekTasks },
			],
		};
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: "",
			password: await hash(dto.password),
		};

		return this.prisma.user.create({
			data: user,
		});
	}

	async update(id: string, dto: UserDto) {
		let data = dto;

		if (dto.password) data = { ...dto, password: await hash(dto.password) };

		return this.prisma.user.update({
			where: {
				id,
			},
			data,
			select: {
				name: true,
				email: true,
			},
		});
	}

	getWithIntervalsCount(userId: string) {
		return this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				intervalsCount: true,
			},
		});
	}
}
