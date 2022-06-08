document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});


class App {
  constructor() {
    this.filmlists = [];
  }

  onEscapeKeydown = ({ key }) => {
    if (key === 'Escape') {
      const input = document.getElementById('add-filmlist-input');
      input.style.display = 'none';
      input.value = '';

      document.getElementById('add-filmlist-button').style.display = 'inherit';
    }
  };

  onInputKeydown = ({ key, target }) => {
    if (key === 'Enter') {
      if (target.value) {
        this.filmlists.push(new Filmlist({
          flName: target.value,
          flID: `FL${this.filmlists.length}`,
          moveFilm: this.moveFilm
        })
        );

        this.filmlists[this.filmlists.length - 1].render();
      }

      target.style.display = 'none';
      target.value = '';

      document.getElementById('add-filmlist-button').style.display = 'inherit';
    }
  };

  moveFilm = ({ filmID, direction }) => {
    let [
      flIndex,
      filmIndex
    ] = filmID.split('-F');
    flIndex = Number(flIndex.split('FL')[1]);
    filmIndex = Number(filmIndex);
    const filmInfo = this.filmlists[flIndex].films[filmIndex];
    const targetFlIndex = (direction === 'left') ? flIndex - 1 : flIndex + 1;

    this.filmlists[flIndex].deleteFilm(filmIndex);
    this.filmlists[targetFlIndex].addFilm(filmInfo);
  };

  init() {
    document.getElementById('add-filmlist-button').addEventListener('click', (event) => {
      event.target.style.display = 'none';

      const input = document.getElementById('add-filmlist-input');
      input.style.display = 'inherit';
      input.focus();
    });

    document.addEventListener('keydown', this.onEscapeKeydown);

    document.getElementById('add-filmlist-input').addEventListener('keydown', this.onInputKeydown);
  }
}

class Filmlist {
  constructor({
    flName,
    flID,
    moveFilm
  }) {
    this.flName = flName;
    this.flID = flID;
    this.films = [];
    this.moveFilm = moveFilm;
  }


  onAddFilmButtonClick = () => {
    const newFilmTitle = prompt('Enter name of a film:');

    if (!newFilmTitle) return;

    const newFilmDescr = prompt('Enter description, synopsis or any other prefered information about the film:');

    const newFilmInfo = {
      filmTitle: newFilmTitle,
      filmDescr: newFilmDescr
    };

    this.addFilm(newFilmInfo);
  };

  addFilm = (filmInfo) => {
    const container = document.querySelector(`#${this.flID} div`);
    container.insertBefore(this.renderFilm({
      filmID: `${this.flID}-F${this.films.length}`,
      filmInfo
    }), container.lastElementChild);

    this.films.push(filmInfo);
  };

  onEditFilm = (filmID) => {
    const filmIndex = Number(filmID.split('-F')[1]);
    const { filmTitle: oldFilmTitle, filmDescr: oldFilmDescr } = this.films[filmIndex];

    const newFilmTitle = prompt('Enter new name of a film:', oldFilmTitle);

    const newFilmDescr = prompt('Enter new description, synopsis or something else you prefer:', oldFilmDescr);

    if (newFilmDescr !== oldFilmDescr) {
      document.querySelector(`#${filmID} > p`).innerHTML = newFilmDescr;
    }

    if (newFilmTitle !== oldFilmTitle) {
      document.querySelector(`#${filmID} > h3`).innerHTML = newFilmTitle;
    }

    this.films[filmIndex].filmTitle = newFilmTitle;
    this.films[filmIndex].filmDescr = newFilmDescr;
  };

  onDeleteFilmButtonClick = (filmID) => {
    const filmIndex = Number(filmID.split('-F')[1]);
    const filmName = this.films[filmIndex].filmTitle;

    if (!confirm(`Card for '${filmName}' will be deleted. Confirm?`)) return;

    this.deleteFilm(filmIndex);
  };

  deleteFilm = (filmIndex) => {
    this.films = this.films.filter((filmInfo) => filmInfo.filmTitle !== this.films[filmIndex].filmTitle);

    this.rerenderFilms();
  };

  rerenderFilms = () => {
    const addFilmButton = document.querySelector(`#${this.flID} > div > *:last-child`)
    const filmlist = document.querySelector(`#${this.flID} > div`);
    filmlist.innerHTML = '';

    this.films.forEach((filmInfo, filmIndex) => {
      filmlist.appendChild(this.renderFilm({
        filmID: `${this.flID}-F${filmIndex}`,
        filmInfo
      }));
    });

    filmlist.appendChild(addFilmButton);
  };

  renderFilm = ({ filmID, filmInfo }) => {
    const film = document.createElement('div');
    film.classList.add('showcard');
    film.id = filmID;

    const filmTitle = document.createElement('h3');
    filmTitle.classList.add('showcard__title');
    filmTitle.innerHTML = filmInfo.filmTitle;
    film.appendChild(filmTitle);

    const filmText = document.createElement('p');
    filmText.classList.add('showcard__text');
    filmText.innerHTML = filmInfo.filmDescr;
    film.appendChild(filmText);

    const controls = document.createElement('div');
    controls.classList.add('showcard__controls');

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.classList.add('showcard__button', 'edit-icon');
    editButton.addEventListener('click', () => this.onEditFilm(filmID));
    controls.appendChild(editButton);

    const leftArrowButton = document.createElement('button');
    leftArrowButton.type = 'button';
    leftArrowButton.classList.add('showcard__button', 'left-arrow');
    leftArrowButton.addEventListener('click', () => this.moveFilm({ filmID, direction: 'left' }));
    controls.appendChild(leftArrowButton);

    const rightArrowButton = document.createElement('button');
    rightArrowButton.type = 'button';
    rightArrowButton.classList.add('showcard__button', 'right-arrow');
    rightArrowButton.addEventListener('click', () => this.moveFilm({ filmID, direction: 'right' }));
    controls.appendChild(rightArrowButton);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('showcard__button', 'delete-icon');
    deleteButton.addEventListener('click', () => this.onDeleteFilmButtonClick(filmID));
    controls.appendChild(deleteButton);

    film.appendChild(controls);

    return film;
  };

  render() {
    const filmlist = document.createElement('section');
    filmlist.classList.add('list');
    filmlist.id = this.flID;

    const listTitle = document.createElement('h2');
    listTitle.classList.add('list__title');
    listTitle.innerHTML = this.flName;

    const showcards = document.createElement('div');
    showcards.classList.add('showcards');

    const addButton = document.createElement('button');
    addButton.classList.add('add-showcard__button');
    addButton.setAttribute('type', 'button');
    addButton.innerHTML = "Add button";
    addButton.addEventListener('click', this.onAddFilmButtonClick);

    showcards.appendChild(addButton);

    filmlist.appendChild(listTitle);
    filmlist.appendChild(showcards);

    const main = document.querySelector('main');
    main.appendChild(filmlist);
  }

}