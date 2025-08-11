import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { TimeBlockDto } from "./dto/time-block.dto";

@Injectable()
export class TimeBlockService {
	constructor(private prisma: PrismaService) {}

	getAll(userId: string) {
		return this.prisma.timeBlock.findMany({
			where: { userId },
			orderBy: {
				order: "asc",
			},
		});
	}

	create(userId: string, dto: TimeBlockDto) {
		return this.prisma.timeBlock.create({
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

	update(userId: string, timeBlockId: string, dto: Partial<TimeBlockDto>) {
		return this.prisma.timeBlock.update({
			where: {
				userId,
				id: timeBlockId,
			},
			data: dto,
		});
	}

	delete(timeBlockId: string) {
		return this.prisma.timeBlock.delete({
			where: {
				id: timeBlockId,
			},
		});
	}

	updateOrder(ids: string[]) {
		return this.prisma.$transaction(
			ids.map((id, index) =>
				this.prisma.timeBlock.update({
					where: { id },
					data: { order: index },
				})
			)
		);
	}
}
