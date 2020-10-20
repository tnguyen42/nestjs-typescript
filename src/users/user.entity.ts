import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class User {
	@PrimaryGeneratedColumn()
	@Exclude()
	public id?: number;

	@Column({ unique: true })
	public email: string;

	@Column()
	public name: string;

	@Column()
	@Exclude()
	public password: string;
}
export default User;
