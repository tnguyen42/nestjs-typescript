import {
	Controller,
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
import { ApiBody, ApiTags } from "@nestjs/swagger";

import UploadFileDto from "./dto/uploadFile.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post("avatar")
	@UseGuards(JwtAuthenticationGuard)
	@UseInterceptors(FileInterceptor("file"))
	@ApiBody({ type: UploadFileDto })
	async addAvatar(
		@Req() request: RequestWithUser,
		@UploadedFile() file: Express.Multer.File,
	) {
		// Use file.mimetype to use conditions on the type of file
		return this.usersService.addAvatar(
			request.user.id,
			file.buffer,
			file.originalname,
		);
	}
}
