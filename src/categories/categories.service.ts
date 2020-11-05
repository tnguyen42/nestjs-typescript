import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Category from "./category.entity";
import CategoryNotFoundException from "./exceptions/categoryNotFound.exception";
import UpdateCategoryDto from "./dto/updateCategory.dto";
import CreateCategoryDto from "./dto/createCategory.dto";

@Injectable()
export default class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
	) {}

	public async getAllCategories() {
		return this.categoryRepository.find({ relations: ["posts"] });
	}

	async getCategoryById(id: number) {
		const category = await this.categoryRepository.findOne(id, {
			relations: ["posts"],
		});
		if (category) {
			return category;
		}
		throw new CategoryNotFoundException(id);
	}

	async createCategory(category: CreateCategoryDto) {
		const newCategory = await this.categoryRepository.create(category);
		await this.categoryRepository.save(newCategory);
		return newCategory;
	}

	async updateCategory(id: number, category: UpdateCategoryDto) {
		await this.categoryRepository.update(id, category);
		const updatedCategory = await this.categoryRepository.findOne(id, {
			relations: ["posts"],
		});
		if (updatedCategory) {
			return updatedCategory;
		}
		throw new CategoryNotFoundException(id);
	}

	async deleteCategory(id: number) {
		const deleteResponse = await this.categoryRepository.delete(id);
		if (!deleteResponse.affected) {
			throw new CategoryNotFoundException(id);
		}
	}
}
