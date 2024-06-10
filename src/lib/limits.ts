export const limits = {
	fuiz: {
		maxSlidesCount: 100,
		maxTitleLength: 100,
		maxPlayerCount: 1000,
		multipleChoice: {
			maxTitleLength: 100,
			introduceQuestion: 3000,
			allowedIntroduceQuestion: [0, 3000, 5000, 7000, 10000, 15000],
			pointsAwarded: 1000,
			allowedPointsAwarded: [0, 500, 1000, 2000],
			allowedTimeLimits: [5000, 15000, 30000, 60000, 120000, 240000],
			defaultTimeLimit: 30000,
			maxAnswerCount: 8
		},
		maxAnswerTextLength: 100
	}
} as const;