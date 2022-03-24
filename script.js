"use strict";

const medNameForm = document.querySelector(".medicine__form");
const medName = document.querySelector(".medname");

class App {
  // Protected Variable

  constructor() {
    //Get data from local storage
    // this._getLocalStorage();

    //Attach event handlers
    medNameForm.addEventListener("submit", this._submitMedName);
  }

  _submitMedName = function (e) {
    e.preventDefault();
    const medicineName = medName.value;
    console.log(medicineName);
  };
}
const app = new App();
