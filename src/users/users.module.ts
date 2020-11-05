import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FilesModule } from "src/files/files.module";
import { UsersController } from "./users.controller";
import { PrivateFilesModule } from "src/privateFiles/privateFiles.module";
import { UsersService } from "./users.service";

import User from "./user.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User]), FilesModule, PrivateFilesModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
