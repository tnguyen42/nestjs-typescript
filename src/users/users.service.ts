import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import User from "./user.entity";
import RegisterDto from "src/users/dto/register.dto";
import { FilesService } from "src/files/files.service";
import { PrivateFilesService } from "src/privateFiles/privateFiles.service";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private readonly filesService: FilesService,
		private readonly privateFilesService: PrivateFilesService,
	) {}

	async getByEmail(email: string) {
		const user = await this.usersRepository.findOne({ email });
		if (user) {
			return user;
		}
		throw new HttpException(
			"User with this email does not exist",
			HttpStatus.NOT_FOUND,
		);
	}

	async getById(id: number) {
		const user = await this.usersRepository.findOne({ id });
		if (user) {
			return user;
		}
		throw new HttpException(
			"User with this id does not exist",
			HttpStatus.NOT_FOUND,
		);
	}

	async create(userData: RegisterDto) {
		const newUser = await this.usersRepository.create(userData);
		await this.usersRepository.save(newUser);
		return newUser;
	}

	async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
		const user = await this.getById(userId);
		const fileId = user.avatar?.id;
		if (fileId) {
			await this.usersRepository.update(userId, {
				...user,
				avatar: null,
			});
		}
		await this.filesService.deletePublicFile(fileId);

		const avatar = await this.filesService.uploadPublicFile(
			imageBuffer,
			filename,
		);
		await this.usersRepository.update(userId, {
			...user,
			avatar,
		});
		return avatar;
	}

	async deleteAvatar(userId: number) {
		const user = await this.getById(userId);
		const fileId = user.avatar?.id;
		if (fileId) {
			await this.usersRepository.update(userId, {
				...user,
				avatar: null,
			});
		}
		await this.filesService.deletePublicFile(fileId);
	}

	async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
		return this.privateFilesService.uploadPrivateFile(
			imageBuffer,
			userId,
			filename,
		);
	}
}
