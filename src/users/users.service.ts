import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import User from "./user.entity";
import PublicFile from "src/files/publicFile.entity";
import PrivateFile from "src/privateFiles/privateFile.entity";
import RegisterDto from "src/users/dto/register.dto";
import { FilesService } from "src/files/files.service";
import { PrivateFilesService } from "src/privateFiles/privateFiles.service";
import { Readable } from "typeorm/platform/PlatformTools";

@Injectable()
export class UsersService {
	public constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private readonly filesService: FilesService,
		private readonly privateFilesService: PrivateFilesService,
	) {}

	public async getByEmail(email: string): Promise<User> {
		const user = await this.usersRepository.findOne({ email });
		if (user) {
			return user;
		}
		throw new HttpException(
			"User with this email does not exist",
			HttpStatus.NOT_FOUND,
		);
	}

	public async getById(id: number): Promise<User> {
		const user = await this.usersRepository.findOne({ id });
		if (user) {
			return user;
		}
		throw new HttpException(
			"User with this id does not exist",
			HttpStatus.NOT_FOUND,
		);
	}

	public async create(userData: RegisterDto): Promise<User> {
		const newUser = await this.usersRepository.create(userData);
		await this.usersRepository.save(newUser);
		return newUser;
	}

	public async addAvatar(
		userId: number,
		imageBuffer: Buffer,
		filename: string,
	): Promise<PublicFile> {
		const user: User = await this.getById(userId);
		const fileId: number = user.avatar?.id;

		if (fileId) {
			await this.usersRepository.update(userId, {
				...user,
				avatar: null,
			});
			await this.filesService.deletePublicFile(fileId);
		}

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

	public async deleteAvatar(userId: number): Promise<void> {
		const user = await this.getById(userId);
		const fileId = user.avatar?.id;
		if (fileId) {
			await this.usersRepository.update(userId, {
				...user,
				avatar: null,
			});
			await this.filesService.deletePublicFile(fileId);
		}
	}

	public async addPrivateFile(
		userId: number,
		imageBuffer: Buffer,
		filename: string,
	): Promise<PrivateFile> {
		return this.privateFilesService.uploadPrivateFile(
			imageBuffer,
			userId,
			filename,
		);
	}

	public async getPrivateFile(
		userId: number,
		fileId: number,
	): Promise<{ stream: Readable; info: PrivateFile }> {
		const file = await this.privateFilesService.getPrivateFile(fileId);
		if (file.info.owner.id === userId) {
			return file;
		}

		throw new UnauthorizedException();
	}

	public async getAllPrivateFiles(
		userId: number,
	): Promise<({ url: string } & PrivateFile)[]> {
		const userWithFiles: User = await this.usersRepository.findOne(
			{ id: userId },
			{ relations: ["files"] },
		);
		if (userWithFiles) {
			return Promise.all(
				userWithFiles.files.map(async (file: PrivateFile) => {
					const url: string = await this.privateFilesService.generatePresignedUrl(
						file.key,
					);

					return {
						...file,
						url,
					};
				}),
			);
		}

		throw new NotFoundException("User with this id does not exist");
	}
}
