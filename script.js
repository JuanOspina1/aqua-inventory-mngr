"use strict";
class MedicineReminder {
  id = (Date.now() + "").slice(-10);

  constructor(type, name, morning, evening, frequency, startDate, endDate) {
    this.type = type;
    this.name = name;
    this.morning = morning;
    this.evening = evening;
    this.frequency = frequency;
    this.startDate = startDate;
    this.endDate = endDate;
  }
  // In the future I hope to add specific new classes based on the type of medication
}

const medForm = document.querySelector(".medicine__form");
const showBtn = document.querySelector(".display__btn");
const submitBtn = document.querySelector(".submit__form__btn");
const medType = document.querySelector(".form__input--type");
const medName = document.querySelector(".med__name");
const medPerDayMorning = document.querySelector(".med__morning__servings");
const medPerDayEvening = document.querySelector(".med__evening__servings");
const medFrequency = document.querySelector(".form__input--frequency");
const medStartDate = document.querySelector(".med__start__date");
const medEndDate = document.querySelector(".med__end__date");
const medContainer = document.querySelector(".container");

class App {
  // Protected Variable
  #medReminders = [];

  constructor() {
    //Get data from local storage
    this._getLocalStorage();

    this._removeExpiredMeds();

    //Attach event handlers
    submitBtn.addEventListener("click", this._submitMedName.bind(this));
    showBtn.addEventListener("click", this._showForm.bind(this));
  }

  _submitMedName = function (e) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    e.preventDefault();
    const type = this._titleCase(medType.value);
    //Need to capitalize this input
    const name = this._titleCase(medName.value);
    // Need to confirm that these are whole, positive numbers
    const morning = +medPerDayMorning.value;
    const evening = +medPerDayEvening.value;

    const frequency = this._titleCase(medFrequency.value);
    // convert these back to a string using the method below
    const startDateObj = new Date(medStartDate.value);
    const endDateObj = new Date(medEndDate.value);

    const startDate = this._formatDate(startDateObj);
    const endDate = this._formatDate(endDateObj);

    // const startDateStr = startDate.toString();

    console.log(type, name, morning, evening, frequency, startDate, endDate);
    console.log(typeof startDate);

    // Need to verify inputs

    let medicine;

    if (!validInputs(morning, evening))
      return alert("Morning & evenings dosages need to be positive numbers!");
    medicine = new MedicineReminder(
      type,
      name,
      morning,
      evening,
      frequency,
      startDate,
      endDate
    );

    // Push the new medicine into the reminders array
    this.#medReminders.push(medicine);

    this._emptyForm();

    this._renderNewMed(medicine);
    console.log(this.#medReminders);

    this._setLocalStorage();
  };

  _renderNewMed(medicine) {
    let html = `
    <li>
        <article class="medicine">
          
          <div class="medicine__data">
            <h3 class="medicine__name">${medicine.name}</h3>
            <h4 class="country__type">Type: ${medicine.type}</h4>
            <p class="medicine__row">Frequency: ${medicine.frequency}</p>
            <p class="medicine__row">Total Meds Per Day: ${
              medicine.morning + medicine.evening
            }</p>
            <p class="medicine__row">Start Date: ${medicine.startDate}</p>

            <p class="medicine__row">End or Refill Date: ${medicine.endDate}</p>
            <input
              type="checkbox"
              class="morning__dose checkbox"
              name="morning__dose"
              value=""
            />
            <label for="morning__dose"> Morning Dose: ${
              medicine.morning
            } </label><br />
            <input
              type="checkbox"
              class="morning__dose checkbox"
              name="evening__dose"
              value=""
            />
            <label for="evening__dose"> Evening Dose: ${
              medicine.evening
            }</label><br />
            <button class="single__delete__btn">Delete</button>
          </div>
        </article>
        </li>
    `;
    medContainer.insertAdjacentHTML("afterbegin", html);

    const singleDeleteBtn = document.querySelector(".single__delete__btn");
    singleDeleteBtn.addEventListener("click", this._deleteSingle.bind(this));
  }

  // test comment to commit
  _emptyForm = function () {
    medName.value = "";
    medPerDayMorning.value = "";
    medPerDayEvening.value = "";
    medStartDate.value = "";
    medEndDate.value = "";

    medForm.classList.add("hidden");
  };

  _showForm = function () {
    medForm.classList.remove("hidden");
    medName.focus();
  };

  _deleteSingle(e) {
    e.preventDefault();
  }

  _titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  _setLocalStorage() {
    localStorage.setItem("medicines", JSON.stringify(this.#medReminders));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("medicines"));
    // console.log(data);

    if (!data) return;

    this.#medReminders = data;
    this.#medReminders.forEach((med) => {
      this._renderNewMed(med);
    });
  }

  _formatDate(dateObj) {
    let date = dateObj.toString().slice(3, 15);
    return date;
  }

  _removeExpiredMeds() {
    // Need to find a way to compare today with the endDate in the object
    let today = new Date();
    let todayStr = this._formatDate(today);

    this.#medReminders = this.#medReminders.filter(
      (med) => med.endDate != todayStr
    );
    console.log(this.#medReminders);

    this._setLocalStorage(this.#medReminders);

    // I have 2 reload twice in order for the correct cards to poplate from the updated array
  }
}
const app = new App();
