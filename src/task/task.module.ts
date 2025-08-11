import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { PrismaService } from "src/services/prisma.service";

@Module({
	controllers: [TaskController],
	providers: [PrismaService, TaskService],
	exports: [TaskService],
})
export class TaskModule {}
