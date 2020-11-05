import { IsNotEmpty } from "class-validator";

export class UploadFileDto {
	@IsNotEmpty()
	file: Express.Multer.File;
}

export default UploadFileDto;
