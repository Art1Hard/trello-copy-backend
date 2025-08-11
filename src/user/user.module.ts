import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "src/services/prisma.service";
import { TaskModule } from "src/task/task.module";

@Module({
	controllers: [UserController],
	providers: [PrismaService, UserService],
	exports: [UserService],
	imports: [TaskModule],
})
export class UserModule {}
