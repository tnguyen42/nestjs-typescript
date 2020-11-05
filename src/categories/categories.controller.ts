import {
	Controller,
	UseInterceptors,
	ClassSerializerInterceptor,
	Get,
	Param,
	// Post,
	// UseGuards,
	Body,
	// Delete,
	Patch,
} from "@nestjs/common";
import CategoriesService from "./categories.service";
import FindOneParams from "../utils/findOneParams";
import UpdateCategoryDto from "./dto/updateCategory.dto";

import { ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags("categories")
@Controller("categories")
@UseInterceptors(ClassSerializerInterceptor)
export default class CategoriesController {
	constructor(private readonly categoriesServices: CategoriesService) {}

	@Get()
	async getAllCategories() {
		return this.categoriesServices.getAllCategories();
	}

	@Get("id")
	async getCategoryById(@Param() { id }: FindOneParams) {
		return this.categoriesServices.getCategoryById(Number(id));
	}

	@Patch("id")
	async updateCategory(
		@Param() { id }: FindOneParams,
		@Body() category: UpdateCategoryDto,
	) {
		return this.categoriesServices.updateCategory(Number(id), category);
	}

	// @Post()
	// @UseGuards(JwtAuthenticationGuard)
	// async createCategory(@Body() category: CreateCategoryDto) {
	// 	return this.categoriesServices.createCategory(category);
	// }

	// @Delete(":id")
	// async deleteCategory(@Param() { id }: FindOneParams) {
	// 	return this.categoriesServices.deleteCategory(Number(id));
	// }
}
