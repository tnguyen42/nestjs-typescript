import {
	Controller,
	Post,
	Delete,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	Get,
	Param,
	Res,
} from "@nestjs/common";

import { JwtAuthenticationGuard } from "src/authentication/jwt-authentication.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import RequestWithUser from "src/authentication/requestWithUser.interface";
import { ApiBody, ApiTags } from "@nestjs/swagger";

import UploadFileDto from "./dto/uploadFile.dto";
import FindOneParams from "src/utils/findOneParams";

import { Writable } from "stream";

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

	@Delete("avatar")
	@UseGuards(JwtAuthenticationGuard)
	async deleteAvatar(@Req() request: RequestWithUser) {
		return this.usersService.deleteAvatar(request.user.id);
	}

	@Post("files")
	@UseGuards(JwtAuthenticationGuard)
	@UseInterceptors(FileInterceptor("file"))
	async addPrivateFile(
		@Req() request: RequestWithUser,
		@UploadedFile() file: Express.Multer.File,
	) {
		return this.usersService.addPrivateFile(
			request.user.id,
			file.buffer,
			file.originalname,
		);
	}

	@Get("files/:id")
	@UseGuards(JwtAuthenticationGuard)
	public async getPrivateFile(
		@Req() request: RequestWithUser,
		@Param() { id }: FindOneParams,
		@Res() res: Writable,
	) {
		const file = await this.usersService.getPrivateFile(
			request.user.id,
			Number(id),
		);

		file.stream.pipe(res);
	}

	@Get("files")
	@UseGuards(JwtAuthenticationGuard)
	async getAllPrivateFiles(@Req() request: RequestWithUser) {
		return this.usersService.getAllPrivateFiles(request.user.id);
	}
}
