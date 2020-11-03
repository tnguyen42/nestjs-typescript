import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./user.entity";
import { FilesModule } from "src/files/files.module";
import { UsersController } from "./users.controller";

@Module({
	imports: [TypeOrmModule.forFeature([User]), FilesModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
