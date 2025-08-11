import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { TaskDto } from "./dto/task.dto";
import { startOfDay, subDays } from "date-fns";

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	getAll(userId: string) {
		return this.prisma.task.findMany({
			where: { userId },
		});
	}

	create(userId: string, dto: TaskDto) {
		return this.prisma.task.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}

	update(userId: string, taskId: string, dto: Partial<TaskDto>) {
		return this.prisma.task.update({
			where: {
				userId,
				id: taskId,
			},
			data: dto,
		});
	}

	delete(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId,
			},
		});
	}

	getCompletedTaskCount(userId: string) {
		return this.prisma.task.count({
			where: { userId, isCompleted: true },
		});
	}

	getTaskCountForPeriod(userId: string, period?: "day" | "week") {
		let start: string;

		if (period === "day") start = startOfDay(new Date()).toISOString();
		else start = startOfDay(subDays(new Date(), 7)).toISOString();

		return this.prisma.task.count({
			where: {
				userId,
				createdAt: {
					gte: start,
				},
			},
		});
	}
}
