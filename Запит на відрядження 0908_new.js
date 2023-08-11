function onCreate() {
  EdocsApi.setAttributeValue({ code: "employee", value: CurrentDocument.initiatorId });
}
function onBeforeCardSave() {
  setEmployeeInfo();
}

function onCardInitialize() {
  setemployeeId();
  setEmployeeInfo();
  setdirectorInityator();
  onChangecurrencyEUR();
  onChangedateRate();
  onChangeCurrencyFrom();
  onChangeCurrencyTo();
  onChangeDate();
  onChangetravelDirection();
  setRate();
  onChangeFlightENG();
  onChangeHotelENG();
  onChangeTaxiENG();
  onChangeCar_relatedENG();
  onChangePublicTransportENG();
  onChangeOther_costsENG();
  onChangeFlight();
  onChangeHotel();
  onChangeTaxi();
  setCalculationOfValues();
  onChangePublicTransport();
  onChangeOther_costs();
  onChangedays();
  onChangemoney_per_day();
  onChangesumAll();
}

function onChangeemployee() {
  EdocsApi.setAttributeValue({ code: "directorInityator", value: null, text: null });
  setemployeeId();
  if (EdocsApi.getAttributeValue("employee").value) setdirectorInityator();
}

function setemployeeId() {
  var employee = EdocsApi.getAttributeValue("employee").value;
  var employeeId = EdocsApi.getAttributeValue("employeeId").value;
  if (employee) employeeId = EdocsApi.getEmployeeDataByEmployeeID(employee).personId;
  if (employeeId != EdocsApi.getAttributeValue("employeeId").value) EdocsApi.setAttributeValue({ code: "employeeId", value: employeeId, text: null });
}

function setdirectorInityator() {
  var employee = EdocsApi.getAttributeValue("employee").value;
  if (!EdocsApi.getAttributeValue("directorInityator").value && employee) {
    var manager = EdocsApi.getEmployeeManagerByEmployeeID(employee);
    if (manager) {
      var unitLevel = manager.unitLevel;
      if (manager.employeeId == Number(employee)) {
        manager = EdocsApi.getEmployeeManagerByEmployeeID(manager.employeeId, manager.unitLevel - 1);
        if (manager) {
          EdocsApi.setAttributeValue({ code: "directorInityator", value: manager.employeeId, text: null });
        } else {
          var i = 2;
          while (!manager && unitLevel > 1) {
            manager = EdocsApi.getEmployeeManagerByEmployeeID(employee, unitLevel - i);
            i++;
          }
          EdocsApi.setAttributeValue({ code: "directorInityator", value: manager.employeeId, text: null });
        }
      } else {
        EdocsApi.setAttributeValue({ code: "directorInityator", value: manager.employeeId, text: null });
      }
    } else {
      var empl = EdocsApi.getEmployeeDataByEmployeeID(employee);
      manager = EdocsApi.getEmployeeManagerByEmployeeID(empl.employeeId, empl.unitLevel - 1);
      if (manager) EdocsApi.setAttributeValue({ code: "directorInityator", value: manager.employeeId, text: null });
    }
  }
}

function onChangetable2() {
  copyTablToFields();
  calculateDaysCount();
  setAndCalculateDays();
}

function copyTablToFields() {
  var table = EdocsApi.getAttributeValue("table2").value;
  var Period_from_copy = "";
  var period_to_copy = "";
  var DaysCount_copy = "";
  var DestinationPlaceCopy = "";
  var ObjectBusinesTripCopy = "";

  if (table) {
    for (var i = 0; i < table.length; i++) {
      var Period_from = EdocsApi.findElementByProperty("code", "Period_from", table[i]).value;
      var period_to = EdocsApi.findElementByProperty("code", "period_to", table[i]).value;
      var DaysCount = EdocsApi.findElementByProperty("code", "DaysCount", table[i]).value;
      var DestinationPlace = EdocsApi.findElementByProperty("code", "DestinationPlace", table[i]).value;
      var ObjectBusinesTrip = EdocsApi.findElementByProperty("code", "ObjectBusinesTrip", table[i]).value;

      Period_from_copy += moment(Period_from).format("DD.MM.YYYY") + "\n\n";
      period_to_copy += moment(period_to).format("DD.MM.YYYY") + "\n\n";
      DaysCount_copy += DaysCount + "\n\n";
      DestinationPlaceCopy += DestinationPlace + "\n\n";
      ObjectBusinesTripCopy += ObjectBusinesTrip + "\n\n";
    }
  }

  EdocsApi.setAttributeValue({ code: "Period_from_copy", value: removeLastSlash(Period_from_copy), text: null });
  EdocsApi.setAttributeValue({ code: "period_to_copy", value: removeLastSlash(period_to_copy), text: null });
  EdocsApi.setAttributeValue({ code: "DaysCount_copy", value: removeLastSlash(DaysCount_copy), text: null });
  EdocsApi.setAttributeValue({ code: "DestinationPlaceCopy", value: removeLastSlash(DestinationPlaceCopy), text: null });
  EdocsApi.setAttributeValue({ code: "ObjectBusinesTripCopy", value: removeLastSlash(ObjectBusinesTripCopy), text: null });
}

function removeLastSlash(str) {
  if (str.substring(str.length - 1, str.length) === "|") str = str.slice(0, -1);
  return str;
}

function onChangePeriod_from() {
  calculateDaysCount();
}

function onChangeperiod_to() {
  calculateDaysCount();
}

function calculateDaysCount() {
  var Period_from = EdocsApi.getAttributeValue("Period_from").value;
  var period_to = EdocsApi.getAttributeValue("period_to").value;
  if (Period_from && period_to) EdocsApi.setAttributeValue({ code: "DaysCount", value: EdocsApi.getVacationDaysCount(Period_from, period_to), text: null });
}

function setAndCalculateDays() {
  var table = EdocsApi.getAttributeValue("table2").value;
  if (table && table.length > 0) {
    var Period_from = EdocsApi.findElementByProperty("code", "Period_from", table[0]).value;
    if (getWorkDays(new Date(new Date(CurrentDocument.created).setHours(0, 0, 0, 0)), new Date(new Date(Period_from).setHours(0, 0, 0, 0))) < 7) {
      throw "Обмеження створення документу за 7 роб днів.";
    }
    var period_to = EdocsApi.findElementByProperty("code", "period_to", table[table.length - 1]).value;
    EdocsApi.setAttributeValue({ code: "dataTripStart", value: Period_from, text: null });
    EdocsApi.setAttributeValue({ code: "dataTripEnd", value: period_to, text: null });
    EdocsApi.setAttributeValue({ code: "days", value: EdocsApi.getVacationDaysCount(Period_from, period_to), text: null });
  } else {
    EdocsApi.setAttributeValue({ code: "dataTripStart", value: null, text: null });
    EdocsApi.setAttributeValue({ code: "dataTripEnd", value: null, text: null });
    EdocsApi.setAttributeValue({ code: "days", value: null, text: null });
  }
}

function getWorkDays(fromDate, toDate) {
  var daysCount = 0;
  while (fromDate < toDate) {
    if (!(fromDate.getDay() == 0 || fromDate.getDay() == 6)) daysCount++;
    fromDate = fromDate.addDays(1);
  }
  return daysCount;
}

function calculateTransportation() {
  EdocsApi.setAttributeValue({ code: "Transportation", value: Number(EdocsApi.getAttributeValue("Flight").value) + Number(EdocsApi.getAttributeValue("Taxi").value) + Number(EdocsApi.getAttributeValue("PublicTransport").value), text: null });

  onChangeTransportation();
}

function onChangePublicTransport() {
  calculateTransportation();
  setCalculationOfValues();
}
function onChangeTaxi() {
  calculateTransportation();
  setCalculationOfValues();
}
function onChangeFlight() {
  calculateTransportation();
  setCalculationOfValues();
}

function calculateTotal() {
  EdocsApi.setAttributeValue({ code: "Total", value: Number(EdocsApi.getAttributeValue("Transportation").value) + Number(EdocsApi.getAttributeValue("Hotel").value) + Number(EdocsApi.getAttributeValue("Car_related").value) + Number(EdocsApi.getAttributeValue("Other_costs").value), text: null });
}

function onChangeTransportation() {
  calculateTotal();
}
function onChangeHotel() {
  calculateTotal();
  setCalculationOfValues();
}
function onChangeCar_related() {
  calculateTotal();
  setCalculationOfValues();
}
function onChangeOther_costs() {
  calculateTotal();
  setCalculationOfValues();
}

//1.Заповнити поле Rate методом зовнішньої системи EdocsGetExchangeRate
function setRate() {
  debugger;

  const currencyEUR = EdocsApi.getAttributeValue("currencyEUR");

  const dateRate = EdocsApi.getAttributeValue("dateRate").value;

  if (currencyEUR.value && dateRate) {
    const methodData = {
      currencyEUR: currencyEUR.value,

      dateRate: dateRate,
    };

    const response = EdocsApi.runExternalFunction("Navision", "EdocsGetExchangeRate", methodData);

    if (!response.data) {
      throw "Не отримано відповіді від зовіншньої системи";
    } else {
      if (response.data.error) {
        EdocsApi.message(response.data.error.message);
      } else {
        EdocsApi.setAttributeValue(response.data);
      }
    }
  } else {
    if (!currencyEUR.text) {
      EdocsApi.setAttributeValue({ code: "rate", value: null, text: null });
    }
  }
}

function onChangecurrencyEUR() {
  setRate();
}
function onChangedateRate() {
  setRate();
}

//2. Заповнити поле CrossCourse методом зовнішньої системи EdocsGetCurrencyRate
function setCurrencyRate() {
  const CurrencyFrom = EdocsApi.getAttributeValue("CurrencyFrom").value;
  const CurrencyTo = EdocsApi.getAttributeValue("CurrencyTo").value;
  const Date = EdocsApi.getAttributeValue("Date").value;
  if (CurrencyFrom && CurrencyTo && Date) {
    const methodData = {
      CurrencyFrom: CurrencyFrom,
      CurrencyTo: CurrencyTo,
      Date: Date,
    };
    const response = EdocsApi.runExternalFunction("Navision", "EdocsGetCurrencyRate", methodData);
    if (!response.data) {
      throw "Не отримано відповіді від зовіншньої системи";
    } else {
      if (response.data.error) {
        EdocsApi.message(response.data.error);
      } else {
        EdocsApi.setAttributeValue({ code: Object.keys(response.data)[0], value: Object.values(response.data)[0] });
      }
    }
  } else {
    EdocsApi.setAttributeValue({ code: "CrossCourse", value: null, text: null });
  }
}
function onChangeCurrencyFrom() {
  setCurrencyRate();
}
function onChangeCurrencyTo() {
  setCurrencyRate();
}

function onChangeDate() {
  setCurrencyRate();
}

//3. Заповнити інформацію по співробітнику методом зовнішньої системи EdocsGetEmploeeInfo
function setEmployeeInfo() {
  const employeeId = EdocsApi.getAttributeValue("employeeId").value;
  if (employeeId) {
    const response = EdocsApi.runExternalFunction("Navision", "EdocsGetEmploeeInfo", {
      employeeId: employeeId,
    });
    if (!response.data) {
      throw "Не отримано відповіді від зовіншньої системи";
    } else {
      if (response.data.error) {
        EdocsApi.message("Ваших даних немає в зовнішній системі");
      } else {
        EdocsApi.setAttributeValue({ code: "name", value: response.data.attributeValues[0].name, text: null });
        EdocsApi.setAttributeValue({ code: "surname", value: response.data.attributeValues[0].surname, text: null });
        EdocsApi.setAttributeValue({ code: "LastName", value: response.data.attributeValues[0].LastName, text: null });
        EdocsApi.setAttributeValue({ code: "position", value: response.data.attributeValues[0].position, text: null });
        EdocsApi.setAttributeValue({ code: "unit", value: response.data.attributeValues[0].unit, text: null });
        EdocsApi.setAttributeValue({ code: "department", value: response.data.attributeValues[0].department, text: null });
      }
    }
  } else {
    EdocsApi.setAttributeValue({ code: "name", value: null, text: null });
    EdocsApi.setAttributeValue({ code: "surname", value: null, text: null });
    EdocsApi.setAttributeValue({ code: "LastName", value: null, text: null });
    EdocsApi.setAttributeValue({ code: "position", value: null, text: null });
    EdocsApi.setAttributeValue({ code: "unit", value: null, text: null });
    EdocsApi.setAttributeValue({ code: "department", value: null, text: null });
  }
}
//Скривати поле Країна
function setControlShow(code) {
  const control = EdocsApi.getControlProperties(code);
  control.hidden = false;
  EdocsApi.setControlProperties(control);
}

function setControlHidden(code) {
  const control = EdocsApi.getControlProperties(code);
  control.hidden = true;
  EdocsApi.setControlProperties(control);
}

function onChangetravelDirection() {
  setmoney_per_day();

  if (EdocsApi.getAttributeValue("travelDirection").value == "За кордон") {
    setControlShow("country");
    //setControlShow("CurrencyFrom");
    //setControlShow("CurrencyTo");
    //setControlShow("Date");
    //setControlShow("CrossCourse");
    setControlShow("currencyEUR");
    setControlShow("dateRate");
    setControlShow("rate");
    setControlShow("amountCurrency");
  } else {
    setControlHidden("country");
    //setControlHidden("CurrencyFrom");
    //setControlHidden("CurrencyTo");
    //setControlHidden("Date");
    //setControlHidden("CrossCourse");
    setControlHidden("currencyEUR");
    setControlHidden("dateRate");
    setControlHidden("rate");
    setControlHidden("amountCurrency");
  }
}

function validationNumber(attr) {
  let number;
  attr.value ? (number = parseFloat(attr.value.split(",").join(".")).toFixed(2)) : (number = 0);
  return number;
}

function setValueAttr(code, value) {
  const attr = EdocsApi.getAttributeValue(code);
  attr.value = value;
  EdocsApi.setAttributeValue(attr);
}

function setCalculationOfValues() {
  setmoney_per_day();

  let flightENG = EdocsApi.getAttributeValue("FlightENG");
  let hotelENG = EdocsApi.getAttributeValue("HotelENG");
  let taxiENG = EdocsApi.getAttributeValue("TaxiENG");
  let car_relatedENG = EdocsApi.getAttributeValue("Car_relatedENG");
  let publicTransportENG = EdocsApi.getAttributeValue("PublicTransportENG");
  let rate = EdocsApi.getAttributeValue("PublicTransportENG");
  let flight = EdocsApi.getAttributeValue("Flight");
  let hotel = EdocsApi.getAttributeValue("Hotel");
  let taxi = EdocsApi.getAttributeValue("Taxi");
  let other_costs = EdocsApi.getAttributeValue("Other_costs");
  const days = EdocsApi.getAttributeValue("days");
  const money_per_day = EdocsApi.getAttributeValue("money_per_day");

  flightENG = validationNumber(flightENG);
  hotelENG = validationNumber(hotelENG);
  taxiENG = validationNumber(taxiENG);
  car_relatedENG = validationNumber(car_relatedENG);
  publicTransportENG = validationNumber(publicTransportENG);
  rate = validationNumber(rate);
  flight = validationNumber(flight);
  hotel = validationNumber(hotel);
  taxi = validationNumber(taxi);
  other_costs = validationNumber(other_costs);

  flight = (flightENG * rate).toFixed(2);
  hotel = (hotelENG * rate).toFixed(2);
  taxi = (taxiENG * rate).toFixed(2);
  car_related = (car_relatedENG * rate).toFixed(2);
  publicTransport = (publicTransportENG * rate).toFixed(2);
  other_costs = (other_costsENG * rate).toFixed(2);

  setValueAttr("Flight", flight);
  setValueAttr("Hotel", hotel);
  setValueAttr("Taxi", taxi);
  setValueAttr("Car_related", car_related);
  setValueAttr("PublicTransport", publicTransport);
  setValueAttr("Other_costs", other_costs);
  setValueAttr("amountCurrency", [flightENG + hotelENG + taxiENG + car_relatedENG + publicTransportENG + other_costsENG]);
  setValueAttr("sumAll", [money_per_day * days]);
}

function setmoney_per_day() {
  const travelDirection = EdocsApi.getAttributeValue("travelDirection");
  if (travelDirection.value) {
    switch (travelDirection.value) {
      case "Україна":
        setValueAttr("money_per_day", 1);
        break;
      case "За кордон":
        setValueAttr("money_per_day", 2);
        break;
      default:
        setValueAttr("money_per_day", null);
        break;
    }
  }
}

function onChangeFlightENG() {
  setCalculationOfValues();
}
function onChangeHotelENG() {
  setCalculationOfValues();
}
function onChangeTaxiENG() {
  setCalculationOfValues();
}
function onChangeCar_relatedENG() {
  setCalculationOfValues();
}
function onChangePublicTransportENG() {
  setCalculationOfValues();
}
function onChangeOther_costsENG() {
  setCalculationOfValues();
}
function onChangedays() {
  setCalculationOfValues();
}
function onChangemoney_per_day() {
  setCalculationOfValues();
}
function onChangesumAll() {
  setCalculationOfValues();
}
