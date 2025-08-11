import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { UserService } from "src/user/user.service";
import { TimerRoundDto, TimerSessionDto } from "./dto/timer.dto";

@Injectable()
export class TimerService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	getTodaySession(userId: string) {
		const today = new Date().toISOString().split("T")[0];

		return this.prisma.pomodoroSession.findFirst({
			where: {
				userId,
				createdAt: {
					gte: new Date(today),
				},
			},
			include: {
				rounds: {
					orderBy: {
						id: "desc",
					},
				},
			},
		});
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId);

		if (todaySession) return todaySession;

		const user = await this.userService.getWithIntervalsCount(userId);

		if (!user) throw new NotFoundException("User not found");
		if (!user.intervalsCount)
			throw new NotFoundException("Intervals count is null");

		return this.prisma.pomodoroSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => ({
							totalSeconds: 0,
						})),
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
			include: { rounds: true },
		});
	}

	update(dto: Partial<TimerSessionDto>, timerId: string, userId: string) {
		return this.prisma.pomodoroSession.update({
			where: {
				userId,
				id: timerId,
			},
			data: dto,
		});
	}

	updateRound(dto: Partial<TimerRoundDto>, roundId: string) {
		return this.prisma.pomodoroRound.update({
			where: { id: roundId },
			data: dto,
		});
	}

	deleteSession(sessionId: string, userId: string) {
		return this.prisma.pomodoroSession.delete({
			where: { id: sessionId, userId },
		});
	}
}
