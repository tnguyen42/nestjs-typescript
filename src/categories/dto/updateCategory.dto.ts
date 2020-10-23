import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

class UpdateCategoryDto {
	@IsNumber()
	@IsOptional()
	id: number;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name: string;
}

export default UpdateCategoryDto;
