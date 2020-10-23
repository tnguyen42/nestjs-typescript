import User from "src/users/user.entity";
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import Category from "../categories/category.entity";

@Entity()
class PostEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public title: string;

	@Column()
	public content: string;

	@ManyToOne(() => User, (author: User) => author.posts)
	public author: User;

	@ManyToMany(() => Category)
	@JoinTable()
	public categories: Category[];
}

export default PostEntity;
