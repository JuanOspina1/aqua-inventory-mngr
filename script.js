"use strict";
class MedicineReminder {
  id = (Date.now() + "").slice(-10);

  constructor(type, name, morning, evening, frequency) {
    this.type = type;
    this.name = name;
    this.morning = morning;
    this.evening = evening;
    this.frequency = frequency;
  }
  // In the future I hope to add specific new classes based on the type of medication
}

const medForm = document.querySelector(".medicine__form");
const showBtn = document.querySelector(".display__btn");
const medType = document.querySelector(".form__input--type");
const medName = document.querySelector(".med__name");
const medPerDayMorning = document.querySelector(".med__morning__servings");
const medPerDayEvening = document.querySelector(".med__evening__servings");
const medFrequency = document.querySelector(".form__input--frequency");

class App {
  // Protected Variable
  #medReminders = [];

  constructor() {
    //Get data from local storage
    // this._getLocalStorage();

    //Attach event handlers
    medForm.addEventListener("submit", this._submitMedName.bind(this));
    showBtn.addEventListener("click", this._showForm.bind(this));
  }

  _submitMedName = function (e) {
    e.preventDefault();
    const type = medType.value;
    const name = medName.value;
    const morning = medPerDayMorning.value;
    const evening = medPerDayEvening.value;
    const frequency = medFrequency.value;
    console.log(type, name, morning, evening, frequency);

    let medicine;
    medicine = new MedicineReminder(type, name, morning, evening, frequency);

    // Push the new medicine into the reminders array
    this.#medReminders.push(medicine);

    this._emptyForm();

    console.log(this.#medReminders);
  };

  _emptyForm = function () {
    medName.value = "";
    medPerDayMorning.value = "";
    medPerDayEvening.value = "";
    medForm.classList.add("hidden");
  };

  _showForm = function () {
    medForm.classList.remove("hidden");
    medName.focus();
  };

  _createMedReminder = function () {};
}
const app = new App();
