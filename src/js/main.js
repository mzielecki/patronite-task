import axios from 'axios';

const dogAPI = axios.create({
	baseURL: 'https://dog.ceo/api/',
	timeout: 1000,
});

const elements = {
	breedList: undefined,
	selectedBreed: undefined,
	modal: undefined,
	closeArea: undefined,
	favoriteBreedsDiv: undefined,
	modalCloseButton: undefined,
	modalFavoriteButton: undefined,
	breedImage: undefined,
	listButton: undefined,
	loader: undefined,
	header: undefined,
	footer: undefined,
};

const showLoading = () => {
	elements.loader.style.display = 'block';
	elements.header.style.display = 'none';
	elements.footer.style.display = 'none';
	elements.listButton.style.display = 'none';
};

const hideLoading = () => {
	elements.loader.style.display = 'none';
	elements.header.style.display = 'flex';
	elements.footer.style.display = 'flex';
	elements.listButton.style.display = 'flex';
};

const fetchDogBreeds = () => {
	showLoading();
	dogAPI
		.get('breeds/list/all')
		.then((response) => {
			if (response) {
				hideLoading();

				const breeds = response.data.message;

				for (const name in breeds) {
					const breedItem = createBreedItem(name);
					elements.breedList.appendChild(breedItem);

					breedItem.addEventListener('click', () => {
						const breedName = name;
						const subBreed =
							breeds[breedName].length > 0 ? breeds[breedName][0] : null;
						fetchBreedImage(breedName, subBreed);
					});
				}
			}
		})
		.catch((error) => {
			console.error('Błąd podczas pobierania danych:', error);
		});
};

const createBreedItem = (name) => {
	const breedItem = document.createElement('div');
	breedItem.className = 'breed-item';

	const dogIcon = document.createElement('i');
	dogIcon.className = 'fa fa-paw';
	breedItem.appendChild(dogIcon);

	breedItem.appendChild(document.createElement('br'));

	const breedNameText = document.createTextNode(name);
	breedItem.appendChild(breedNameText);

	return breedItem;
};

const updateBreedInfo = (breedName, imageUrl) => {
	elements.breedImage.src = imageUrl;
	elements.selectedBreed.textContent = breedName;
	elements.modal.style.display = 'block';
	elements.closeArea.style.display = 'block';

	const favorites = JSON.parse(localStorage.getItem('favoriteBreeds')) || [];
	const breedIndex = favorites.findIndex(
		(item) => item.breedName === breedName
	);
	elements.modalFavoriteButton.className =
		breedIndex !== -1 ? 'fa fa-heart' : 'fa fa-heart-o';
};

const fetchBreedImage = (breedName, subBreed) => {
	let apiUrl = `breed/${breedName}/images/random`;

	if (subBreed) {
		apiUrl = `breed/${breedName}/${subBreed}/images/random`;
	}

	dogAPI
		.get(apiUrl)
		.then((response) => {
			const imageUrl = response.data.message;
			updateBreedInfo(breedName, imageUrl);
		})
		.catch((error) => {
			console.error('Błąd podczas pobierania zdjęcia:', error);
		});
};

const closeModal = () => {
	elements.modal.style.display = 'none';
	elements.closeArea.style.display = 'none';
};

const updateFavoriteButton = () => {
	const breedName = elements.selectedBreed.textContent;
	const imageUrl = elements.breedImage.src;

	let favorites = JSON.parse(localStorage.getItem('favoriteBreeds')) || [];

	const breedIndex = favorites.findIndex((item) => item.breedName == breedName);

	if (breedIndex === -1) {
		favorites.push({ breedName, imageUrl });
		elements.modalFavoriteButton.className = 'fa fa-heart';
	} else {
		favorites.splice(breedIndex, 1);
		elements.modalFavoriteButton.className = 'fa fa-heart-o';
	}

	localStorage.setItem('favoriteBreeds', JSON.stringify(favorites));
	updateFavoriteBreeds();
};

const updateFavoriteBreeds = () => {
	elements.favoriteBreedsDiv.innerHTML = '';

	const favorites = JSON.parse(localStorage.getItem('favoriteBreeds')) || [];

	favorites.forEach((favorite, index) => {
		const favoriteBreedItem = document.createElement('div');
		favoriteBreedItem.className = 'favorite-breed-item';

		const favoriteBreedName = document.createElement('span');
		favoriteBreedName.textContent = favorite.breedName;

		const favoriteBreedImage = document.createElement('img');
		favoriteBreedImage.src = favorite.imageUrl;

		const removeFromFavorites = document.createElement('i');
		removeFromFavorites.className = 'fav-remove';
		removeFromFavorites.textContent = 'X';

		removeFromFavorites.addEventListener('click', () => {
			favorites.splice(index, 1);
			localStorage.setItem('favoriteBreeds', JSON.stringify(favorites));
			updateFavoriteBreeds();
		});

		favoriteBreedItem.appendChild(removeFromFavorites);
		favoriteBreedItem.appendChild(favoriteBreedName);
		favoriteBreedItem.appendChild(favoriteBreedImage);
		elements.favoriteBreedsDiv.appendChild(favoriteBreedItem);
	});
};

const animateList = () => {
	const favoriteBreedsDiv = elements.favoriteBreedsDiv;

	if (favoriteBreedsDiv.classList.contains('active')) {
		favoriteBreedsDiv.classList.remove('active');
	} else {
		favoriteBreedsDiv.classList.add('active');
	}
};

const getHTMLelements = () => {
	elements.modalCloseButton = document.getElementById('close-tag');
	elements.breedList = document.getElementById('breed-list');
	elements.selectedBreed = document.getElementById('selected-breed-text');
	elements.modal = document.getElementById('modal');
	elements.closeArea = document.getElementById('close-area');
	elements.favoriteBreedsDiv = document.getElementById('favorite-breeds');
	elements.modalFavoriteButton = document.getElementById('favorite-button');
	elements.breedImage = document.getElementById('breed-image');
	elements.listButton = document.getElementById('list-button');
	elements.loader = document.getElementById('loader');
	elements.header = document.getElementById('header');
	elements.footer = document.getElementById('footer');
};

const installHandlers = () => {
	elements.modalCloseButton.addEventListener('click', closeModal);
	elements.closeArea.addEventListener('click', closeModal);
	elements.modalFavoriteButton.addEventListener('click', updateFavoriteButton);
	elements.listButton.addEventListener('click', animateList);
};

export const init = () => {
	getHTMLelements();
	installHandlers();
	fetchDogBreeds();
	updateFavoriteBreeds();
};
