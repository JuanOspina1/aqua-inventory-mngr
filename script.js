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

    //Attach event handlers
    submitBtn.addEventListener("click", this._submitMedName.bind(this));
    showBtn.addEventListener("click", this._showForm.bind(this));
  }

  _submitMedName = function (e) {
    e.preventDefault();
    const type = medType.value;
    //Need to capitalize this input
    const name = medName.value;
    // Need to confirm that these are whole, positive numbers
    const morning = medPerDayMorning.value;
    const evening = medPerDayEvening.value;

    const frequency = medFrequency.value;
    const startDate = medStartDate.value;
    const endDate = medEndDate.value;

    console.log(type, name, morning, evening, frequency, startDate, endDate);

    // Need to verify inputs

    let medicine;
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
    <div class="medicines">
        <article class="medicine">
          <img class="country__img" src="" />
          <div class="medicine__data">
            <h3 class="medicine__name">${medicine.name}</h3>
            <h4 class="country__type">Type: <br/> ${medicine.type}</h4>
            <p class="medicine__row">Frequency: <br/> ${medicine.frequency}</p>
            <p class="medicine__row">Total Meds Per Day: <br/>${
              medicine.morning + medicine.evening
            }</p>
            <p class="medicine__row">Start Date: <br/>${medicine.startDate}</p>

            <p class="medicine__row">End or Refill Date: <br/> ${
              medicine.endDate
            }</p>
            <input
              type="checkbox"
              class="morning__dose checkbox"
              name="morning__dose"
              value=""
            />
            <label for="morning__dose"> Morning Dose <br/>${
              medicine.morning
            } </label><br />
            <input
              type="checkbox"
              class="morning__dose checkbox"
              name="evening__dose"
              value=""
            />
            <label for="evening__dose"> Evening Dose <br/>${
              medicine.evening
            }</label><br />
            <button class="single__delete__btn">Delete</button>
          </div>
        </article>
      </div>
    `;
    medContainer.insertAdjacentHTML("afterend", html);

    const singleDeleteBtn = document.querySelector(".single__delete__btn");
    singleDeleteBtn.addEventListener("click", this._deleteSingle.bind(this));
  }

  // test comment to commit
  _emptyForm = function () {
    medName.value = "";
    medPerDayMorning.value = "";
    medPerDayEvening.value = "";
    medForm.classList.add("hidden");
  };

  _showForm = function () {
    medForm.classList.remove("hidden");
    medName.focus();
    console.log("clicked");
  };

  _deleteSingle(e) {
    e.preventDefault();
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
}
const app = new App();
