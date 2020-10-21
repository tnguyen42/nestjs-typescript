import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
} from "typeorm";
import { Exclude } from "class-transformer";
import Address from "./address.entity";

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

	@OneToOne(() => Address)
	@JoinColumn()
	public address: Address;
}

export default User;
