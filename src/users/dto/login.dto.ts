import { IsEmail, IsNumberString } from "class-validator";

export class LoginDto {
	@IsEmail()
	email: string;

	@IsNumberString()
	password: string;
}

export default LoginDto;
