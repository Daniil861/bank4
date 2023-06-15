export const configMain = {
	isAcceptPrivacy: false,
	isInputedName: false,

	notifications: true,
	recomendations: true,

	filters: {
		credit: {
			freeService: false,
			rait: false,
			cash: false
		},
		debet: {
			freeService: false,
			yearMoney: false,
			cash: false
		},
	},

	user: {
		name: null,
		lastName: null,
		fullName: null
	}
}