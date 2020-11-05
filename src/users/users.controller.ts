import {
	Controller,
	Get,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";

import { JwtAuthenticationGuard } from "src/authentication/jwt-authentication.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import RequestWithUser from "src/authentication/requestWithUser.interface";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post("avatar")
	@UseGuards(JwtAuthenticationGuard)
	@UseInterceptors(FileInterceptor("file"))
	async addAvatar(
		@Req() request: RequestWithUser,
		@UploadedFile() file: Express.Multer.File,
	) {
		// TODO: Issue probably probably come from the guard
		console.log("File upload");
		// Use file.mimetype to use conditions on the type of file
		return this.usersService.addAvatar(
			request.user.id,
			file.buffer,
			file.originalname,
		);
	}

	// TODO: remove this
	// @Get("test")
	// async printHello() {
	// 	console.log("Hello");
	// }
}
