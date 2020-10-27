import User from "../user.entity";

const mockedUser: User = {
	id: 1,
	email: "user@email.com",
	name: "John",
	password: "strongPassword",
	address: {
		id: 1,
		street: "streetName",
		city: "cityName",
		country: "countryName",
	},
};

export default mockedUser;
