const mockedConfigService = {
	get(key: string) {
		switch (key) {
			case "JWT_EXPIRATION_TIME":
				return 5000000;
			case "SECRET_KEY":
				return "this_is_my_secret_string";
		}
	},
};

export default mockedConfigService;
