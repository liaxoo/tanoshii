export let PopularAnimeQuery = `
query($perPage: Int, $page: Int, $format: MediaFormat) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(sort: POPULARITY_DESC, type: ANIME, format: $format) {
      id
      title {
        romaji
        english
        userPreferred
      }
      bannerImage
      coverImage {
        medium
        large
        extraLarge
      }
      description
      episodes
    }
  }
}
`;

export let TrendingAnimeQuery = `
	query($perPage: Int, $page: Int) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				perPage
				currentPage
				lastPage
				hasNextPage
			}
			media (sort :TRENDING_DESC, type : ANIME){
				id
				title {
					romaji
					english
					userPreferred
				}
				bannerImage
				coverImage {
					medium
        	large
        	extraLarge
				}
				description
				episodes

			}
		}
	}
`;

export let top100AnimeQuery = `
	query($perPage: Int, $page: Int) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				perPage
				currentPage
				lastPage
				hasNextPage
			}
			media (sort :SCORE_DESC, type : ANIME){
				id
				title {
					romaji
					english
					userPreferred
				}
				bannerImage
				coverImage {
					medium
        	large
        	extraLarge
				}
				description
				episodes

			}
		}
	}
`;

export let favouritesAnimeQuery = `
	query($perPage: Int, $page: Int) {
		Page(page: $page, perPage: $perPage) {
			pageInfo {
				total
				perPage
				currentPage
				lastPage
				hasNextPage
			}
			media(sort: FAVOURITES_DESC, type: ANIME) {
				id
				title {
					romaji
					english
					userPreferred
				}
				bannerImage
				coverImage {
					medium
					large
					extraLarge
				}
				description
				episodes
			}
		}
	}
`;

export let searchAnimeQuery = `
	query($search: String) {
		Page(page: 1, perPage: 100) {
			media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
				id
				title {
					romaji
					english
					native
					userPreferred
				}
				genres
				bannerImage
				coverImage {
					extraLarge
					large
				}
			}
		}
	}
`;

export let searchByIdQuery = `
	query($id: Int) {
		Media(id: $id, type: ANIME){
			title {
				romaji
				english
				native
				userPreferred
			}
			id
			type
			status
			genres
			description
			startDate {
				year
				month
				day
			}
			endDate {
				year
				month
				day
			}
      episodes
	  
			averageScore
			bannerImage
			coverImage {
				extraLarge
				large
			}
			recommendations(sort: RATING_DESC) {
				edges {
					node {
						mediaRecommendation {
							title {
								english
								romaji
							}
							id
							coverImage {
								large
							}
						}
					}
				}
			}
		}
	}
`;

export let searchWatchedId = `
	query($ids: [Int]) {
		Page(page: 1, perPage: 100) {
			media(idMal_in: $ids, type: ANIME, sort: SEARCH_MATCH){
				title {
					romaji
					userPreferred
					english
				}
				coverImage {
					large
					extraLarge
				}
				idMal
			}
		}
	}
`;

export let searchByAniIdQuery = `
	query($id: Int) {
		Media(id: $id){
			title {
				romaji
				english
				native
				userPreferred
			}
			type
			status
			genres
			description
			startDate {
				year
				month
				day
			}
			endDate {
				year
				month
				day
			}
			averageScore
			bannerImage
			coverImage {
				extraLarge
				large
			}
		}
	}
`;
