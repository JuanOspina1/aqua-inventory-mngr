"use strict";

// Possible API for medication names : https://clinicaltables.nlm.nih.gov/apidoc/rxterms/v3/doc.html
class MedicineReminder {
  constructor(id, type, name, morning, evening, frequency, startDate, endDate) {
    this.id = id;
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
    //Get data from local storage - I need to update this so the object is create again using the class - expired meds are removed
    this._getLocalStorage();

    //Attach event handlers
    submitBtn.addEventListener("click", this._submitMedName.bind(this));
    showBtn.addEventListener("click", this._showForm.bind(this));
  }

  _submitMedName = function (e) {
    // Collecting inputs from the form and validation of inputs
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every((inp) => inp >= 0);

    e.preventDefault();

    // Capilatize the type and name
    const type = this._titleCase(medType.value);
    const name = this._titleCase(medName.value);

    const morning = +medPerDayMorning.value;
    const evening = +medPerDayEvening.value;

    const frequency = this._titleCase(medFrequency.value);
    // Convert these back to a string using the method below
    // Due to the way the picker works, I need to modify the value so it reads the correct date
    const startDateObj = new Date(medStartDate.value.replace(/-/g, "/"));
    const endDateObj = new Date(medEndDate.value.replace(/-/g, "/"));
    console.log(startDateObj.getTime());
    console.log(endDateObj.getTime());

    const startDate = this._formatDate(startDateObj);
    const endDate = this._formatDate(endDateObj);

    const id = (Date.now() + "").slice(-10);

    let medicine;

    // validate inputs and confirm that all fields are filled
    if (
      !name ||
      startDate === "alid Date" ||
      endDate === "alid Date" ||
      !validInputs(morning, evening) ||
      !allPositive(morning, evening)
    )
      return alert(
        "Please fill out all fields. Morning & evenings dosages need to be positive numbers!"
      );

    // Check if the end date is on or after the start date
    // If this fails once, the alert keeps coming up
    if (startDateObj.getTime() > endDateObj.getTime())
      return alert(
        "The end date must be the same or later than the start date"
      );

    medicine = new MedicineReminder(
      id,
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

    // Empty the forms after receiving inputs
    this._emptyForm();

    // Render a new card
    this._renderNewMed(medicine);
    // console.log(this.#medReminders);

    // Set the new card to storage - in the future this will be a database instead of local
    this._setLocalStorage();
  };

  _renderNewMed(medicine) {
    let html = `
    <li data-id='${medicine.id}'>
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

    // Button even handler attached AFTER it is created
    const singleDeleteBtn = document.querySelector(".single__delete__btn");
    singleDeleteBtn.addEventListener("click", this._deleteSingle.bind(this));
  }

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
    let id = e.path[3].dataset.id;
    this.#medReminders = this.#medReminders.filter((med) => med.id != id);

    this._setLocalStorage();

    // This removes everything
    medContainer.innerHTML = "";

    // This repopulates the cards based on the new local storage
    this._getLocalStorage();
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

    // Set array to empty
    this.#medReminders = [];

    let rebuilt;

    data.forEach((med) => {
      // Check for expired meds, then rebuild
      let today = new Date();
      let todayStr = this._formatDate(today);

      if (med.endDate != todayStr) {
        const id = med.id;
        const type = med.type;
        const name = med.name;
        const morning = med.morning;
        const evening = med.evening;
        const frequency = med.frequency;
        const startDate = med.startDate;
        const endDate = med.endDate;

        rebuilt = new MedicineReminder(
          id,
          type,
          name,
          morning,
          evening,
          frequency,
          startDate,
          endDate
        );

        // push the rebuilt objects as classes into the main arr
        this.#medReminders.push(rebuilt);

        this._renderNewMed(rebuilt);

        this._setLocalStorage();

        console.log(rebuilt.constructor.name);
      }
    });
    console.log(`Objects have been rebuilt`);
  }

  _formatDate(dateObj) {
    let date = dateObj.toString().slice(3, 15);
    return date;
  }
}
const app = new App();
