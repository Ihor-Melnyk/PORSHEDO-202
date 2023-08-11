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

function onChangetravelDirection() {
  setmoney_per_day();
}

function onCardInitialize() {
  onChangetravelDirection();
  onChangeFlightENG();
  onChangeHotelENG();
  onChangeTaxiENG();
  onChangeCar_relatedENG();
  onChangePublicTransportENG();
  onChangeOther_costsENG();
  onChangeFlight();
  onChangeHotel();
  onChangeTaxi();
  onChangeCar_related();
  onChangePublicTransport();
  onChangeOther_costs();
  onChangedays();
  onChangemoney_per_day();
  onChangesumAll();
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
function onChangeFlight() {
  setCalculationOfValues();
}
function onChangeHotel() {
  setCalculationOfValues();
}
function onChangeTaxi() {
  setCalculationOfValues();
}
function onChangeCar_related() {
  setCalculationOfValues();
}
function onChangePublicTransport() {
  setCalculationOfValues();
}
function onChangeOther_costs() {
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
