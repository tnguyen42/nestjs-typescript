import { UsersService } from "../users/users.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterDto } from "../users/dto/register.dto";
import * as bcrypt from "bcrypt";
import { PostgresErrorCode } from "../database/postgresErrorCode.enum";

import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./tokenPayload.interface";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import Address from "../users/address.entity";
import User from "../users/user.entity";

@Injectable()
export class AuthenticationService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		@InjectRepository(Address)
		private addressRepository: Repository<Address>,
	) {}

	public async register(registrationData: RegisterDto): Promise<User> {
		const hashedPassword = await bcrypt.hash(registrationData.password, 10);

		try {
			const createdUser = await this.usersService.create({
				...registrationData,
				password: hashedPassword,
			});
			
			return createdUser;
		} catch (error) {
			if (error?.code === PostgresErrorCode.UniqueViolation) {
				throw new HttpException(
					"User with that email already exists",
					HttpStatus.BAD_REQUEST,
				);
			}
			throw new HttpException(
				"Something went wrong",
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async getAuthenticatedUser(
		email: string,
		plainTextPassword: string,
	): Promise<User> {
		try {
			const user = await this.usersService.getByEmail(email);
			await this.verifyPassword(plainTextPassword, user.password);
			return user;
		} catch (error) {
			throw new HttpException(
				"Wrong credentials provided",
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	private async verifyPassword(
		plainTextPassword: string,
		hashedPassword: string,
	) {
		const isPasswordMatching = await bcrypt.compare(
			plainTextPassword,
			hashedPassword,
		);
		if (!isPasswordMatching) {
			throw new HttpException(
				"Wrong credentials provided",
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	public getCookieWithJwtToken(userId: number): string {
		const payload: TokenPayload = { userId };
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get("JWT_SECRET"),
			expiresIn: `${this.configService.get("JWT_EXPIRATION_TIME")}s`,
		});
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
			"JWT_EXPIRATION_TIME",
		)}`;
	}

	public getCookieForLogOut(): string {
		return `Authentication=; HttpOnly; Path=/; Max-Age: 0`;
	}

	public getAllAddressesWithUsers(): Promise<Address[]> {
		return this.addressRepository.find({ relations: ["user"] });
	}
}
