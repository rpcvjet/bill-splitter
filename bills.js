'use strict';

var houseUser = [];
var roommate = [];
var bills = [];

if (localStorage.getItem('roommates')) {

    console.log('Fetching LS...');
    roommate = JSON.parse(localStorage.getItem('roommates'));
    console.log(roommate);
} else {
    roommate = [
        { userID: 'jedthompson', firstName: 'Jed', lastName: 'Thompson', email: 'jedlee2004@gmail.com', unpaid: [] },
        { userID: 'firshtashefa', firstName: 'Firshta', lastName: 'Shefa', email: 'firshtashefa@gmail.com', unpaid: [] },
        { userID: 'jeffwallace', firstName: 'Jeff', lastName: 'Wallace', email: 'rs4race@gmail.com', unpaid: [] },
        { userID: 'jasonchu', firstName: 'Jason', lastName: 'Chu', email: 'jchu@gmail.com', unpaid: [] },
    ];
}

(function roommateSelect() {
    var parent = document.getElementById('rmOptions');
    for (var i = 0; i < roommate.length; i++) {
        var option = document.createElement('option');
        option.value = roommate[i].firstName + ' ' + roommate[i].lastName;
        option.id = roommate[i].userID;
        option.innerHTML = roommate[i].firstName + ' ' + roommate[i].lastName;
        parent.appendChild(option);
    }
}());

  roommate = JSON.parse(localStorage.getItem('roommates'));
}
if (localStorage.getItem('Bills')) {
  bills = JSON.parse(localStorage.getItem('Bills'));
}

//create checbox and text input for each roommate
function createChkBox(parentEl, obj) {
  var parent = document.getElementById(parentEl);
  var div = document.createElement('div');
  div.id = "customAmnt";
  for (var i = 0; i < obj.length; i++) {
    var label = document.createElement('label');
    var inputChkBox = document.createElement('input');
    var text = document.createElement('input');
    inputChkBox.type = 'checkbox';
    inputChkBox.name = 'roommates';
    inputChkBox.value = (obj[i].firstName + obj[i].lastName).toLowerCase();
    inputChkBox.checked = 'on';
    inputChkBox.id = 'check' + i;
    text.type = 'text';
    text.name = 'customAmnt';
    text.id = 'check' + i + 'txt';
    label.for = obj[i].firstName + ' ' + obj[i].lastName;
    label.innerHTML = obj[i].firstName + ' ' + obj[i].lastName;
    div.appendChild(label);
    div.appendChild(inputChkBox);
    div.appendChild(text);
  }
  parent.appendChild(div);
}
createChkBox('checkboxes', roommate);

var customBill = document.getElementById('customAmnt');
customBill.addEventListener('change', customBillHandler);

function customBillHandler(event) {
  event.preventDefault();
  var chkBox = event.target;
  var customAmnt = document.getElementById(chkBox.id + 'txt');
  //disable txt input upon unchecking roommate;
  if (chkBox.checked) {
    customAmnt.style.visibility = 'visible';
      //customAmnt.style.display = '';
  }
  if (!chkBox.checked) {
    customAmnt.style.visibility = 'hidden';
      //customAmnt.style.display = 'none';
  }
}


var billForm = document.getElementById('bill-form');
billForm.addEventListener('submit', newBillHandler);

//Event Handler
function newBillHandler(event) {

    event.preventDefault();
    var options = event.target.rmOptions;
    var roommatesArr = [];
    (function() {
        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                roommatesArr.push(options[i].id);
            }
        }
    }());

  event.preventDefault();
  var totalPercent = 0;
  var roommates = [];
  //retrieve roommates selected and custom bill amount and push to roommates[];
  (function() {
    var customAmntArr = document.forms['bill-form'].elements.customAmnt;
    var chkBoxArr = document.forms['bill-form'].elements.roommates;

    //Filtering for the selected roommates form the checkbox array
    var checked = [];
    for (var i = 0; i < chkBoxArr.length; i++) {
      if (chkBoxArr[i].checked) {
        var checkedObj = {
          id: chkBoxArr[i].value,
          customAmnt: customAmntArr[i].value,
        };
        console.log('object of checked input', checkedObj);
        checked.push(checkedObj);
      };
    }

    for (var i = 0; i < checked.length; i++) {
      var individualBill = {
        name: checked[i].id,
        percentOwed: 0,
        amountOwed: 0,
        paid: 0
      };

      if (checked[i].id && checked[i].customAmnt) {
        individualBill.percentOwed = (parseFloat(checked[i].customAmnt) / 100).toFixed(2);
      }
      if (checked[i].id && !checked[i].customAmnt) {
        individualBill.percentOwed = parseFloat(1 / checked.length).toFixed(2);
      }

      if (totalPercent <= 1) {
        totalPercent += parseFloat(individualBill.percentOwed);
      }
      if (totalPercent > 1) {
        alert('Your total exceeds 100% of the bill!');
        break;
      }
      console.log('Percent owed', individualBill);

      roommates.push(individualBill);
    }
  }());


    //retrieve form values
  var name = event.target.billname.value;
  var amountDue = parseFloat(event.target.amount.value);
  var frequency = parseInt(event.target.frequency.value);
  var category = event.target.category.value;
  var dueDate = event.target.duedate.value;


    //Creatomg Bill Object
    var newBill = new Bill(roommatesArr, name, amountDue, frequency, category, dueDate);

    //Updating data structures
    bills.push(newBill);
    newBill.splitBill();

    //Saving to local storage
    localStorage.setItem('Bills', JSON.stringify(bills));
    localStorage.setItem('roommates', JSON.stringify(roommate));

    //clear form
    billForm.reset();
}

// Bill Constructor
function Bill(roommates, name, amountDue, frequency, category, dueDate) {
    this.roommates = roommates;
    this.name = name;
    this.amountDue = amountDue;
    this.frequency = frequency;
    this.category = category;
    this.paid = false;
    this.dueDate = dueDate;

    this.splitBill = function() {
        var div = this.roommates.length;
        for (var i = 0; i < div; i++) {
            if (roommate.indexOf(this.roommates[i])) {
                var splitAmnt = this.amountDue / div; //rework split calculation
                var billObj = new NewRmBill(this.name, splitAmnt, this.dueDate, this.category);
                var rmIndex = roommate.findIndex(x => x.userID == this.roommates[i]);
                roommate[rmIndex].unpaid.push(billObj);
                console.log('unpaid', roommate[rmIndex].unpaid);
            } else {
                return Error;
            }
        }
    }

    this.removeBill = function() {
        var billIndex = bills.findIndex(x => x.name == this.roommates[i]);
        var rmBillIndex;
        bills.splice(billIndex, 1);
        //remove from bills array and from unpaid array of each roommate obj
    }

    this.modifyBill = function() {
        //  var billToModify = bills.indexOf(this.bills.name);
        var bill
    }

    //Creating Bill Object
  if (roommates && name && amountDue && frequency && category && dueDate) {
    var newBill = new Bill(roommates, name, amountDue, frequency, category, dueDate, bills.length);
    newBill.splitBill();

        //Saving to local storage
    localStorage.setItem('Bills', JSON.stringify(bills));
    localStorage.setItem('roommates', JSON.stringify(roommate));

    billForm.reset();
  } else {
    console.log(totalPercent);
    if (totalPercent !== 1.00) {
      alert('Please look at how you divided the bill!');
    } else {
      alert('Please fill out all fields for the bill!');
    }
  }
}

function Bill(roommates, name, amountDue, frequency, category, dueDate, id) {
  this.roommates = roommates;
  this.name = name;
  this.amountDue = amountDue;
  this.frequency = frequency;
  this.category = category;
  this.paid = 0; //handle later
  this.dueDate = dueDate;
  this.id = id;
  bills.push(this);

  this.splitBill = function() {
    if (localStorage.getItem('roommates')) {
      roommate = JSON.parse(localStorage.getItem('roommates'));
    }
    console.log('roommates arr length', this.roommates);
    for (var i = 0; i < this.roommates.length; i++) {
      var selectedRM = this.roommates[i];
      if (roommate.indexOf(selectedRM.roommate)) {
        if (selectedRM.percentOwed) {
          selectedRM.amountOwed = (this.amountDue * selectedRM.percentOwed).toFixed(2);
        }
      } else {
        return Error;
      }
    }
  };

  Bill.prototype.removeBill = function() {
    var billToDel = bills.indexOf(this.bills.name);
    bills.splice(billToDel, 1);
  };

  Bill.prototype.modifyBill = function() {
        //  var billToModify = bills.indexOf(this.bills.name);
  };
  Bill.prototype.payDown = function() {
    this.amountDue = this.amountDue - this.amountPaid;
  };
}

function makeHeaderRow() {
  var headings = ['Bill Name', 'Category', 'Due Date', 'Amount Due', 'Total Bill'];
  var table = document.getElementById('billTable');
  var rowElement = document.createElement('tr');
  for (var i = 0; i < headings.length; i++){
    var headElement = document.createElement('th');
    headElement.textContent = headings[i];
    rowElement.appendChild(headElement);
  }
  table.appendChild(rowElement);

}
function fillBillTable(){
  var table = document.getElementById('billTable');
  table.innerHTML = '';
  makeHeaderRow();
  var rowElement = document.createElement('tr');
  var dataElement = document.createElement('td');
  dataElement.textContent = 'Total';
  rowElement.appendChild(dataElement);


// roommate bill portion Constructor
function NewRmBill(name, amountDue, dueDate, category) {
    this.name = name;
    this.amountDue = amountDue;
    this.dueDate = dueDate;
    this.category = category;
}

function LocalStorage(key, obj) {
    this.key = key;
    this.obj = obj;

    this.saveObj = function() {
        var objToJSON = JSON.stringify(this.obj);
        localStorage.setItem(this.key, this.objToJSON);
    };

    this.getObj = function() {
        var storedObj = localStorage.getItem(this.key);
        var objToArr = JSON.parse(storedObj);
        return objToArr;
    };

    this.deleteObj = function() {
        localStorage.removeItem(this.key);
    };
}

(function displayBills() {
    billList.innerHTML = '';
    for (var i = 0; i < bills.length; i++) {
        var ulElement = document.getElementById('billList');
        var lineElement = document.createElement('li');
        lineElement.textContent = 'Bill Name: ' + bills[i].name + ' Amount: ' + bills[i].amountDue + ' ' + bills[i].dueDate;
        ulElement.appendChild(lineElement);
    }
}())

  for(var i = 0; i < bills.length; i++){
    rowElement = document.createElement('tr');
    rowElement.setAttribute('id', bills[i].id);
    dataElement = makeTD(bills[i].id);
    dataElement.textContent = bills[i].name;
    rowElement.appendChild(dataElement);
    dataElement = makeTD(bills[i].id);
    dataElement.textContent = bills[i].category;
    rowElement.appendChild(dataElement);
    dataElement = makeTD(bills[i].id);
    dataElement.textContent = bills[i].dueDate;
    rowElement.appendChild(dataElement);
    dataElement = makeTD(bills[i].id);
    dataElement.textContent = bills[i].amountPaid;
    rowElement.appendChild(dataElement);
    dataElement = makeTD(bills[i].id);
    dataElement.textContent = bills[i].amountDue;
    rowElement.appendChild(dataElement);
    table.appendChild(rowElement);
  }
}
function makeTD(id){
  var dataElement = document.createElement('td');
  dataElement.setAttribute('id', id);
  return dataElement;
}

var billDiv = document.getElementById('billList');
var individualBillTable = document.getElementById('individualBillTable');
billDiv.addEventListener('click', handleIndividualBillDisplay);

function handleIndividualBillDisplay(event) {
  var billToDisplay = parseInt(event.target.id);
  for (var i = 0; i < bills.length; i++){
    if (billToDisplay === bills[i].id){
      individualBillTable.innerHTML = '';
      buildIndividualBillHeader(billToDisplay);
      for (var j = 0; j < bills[i].roommates.length; j++){
        var rowElement = document.createElement('tr');
        var dataElement = document.createElement('td');
        console.log(bills[i].roommates[j].name);
        dataElement.textContent = bills[i].roommates[j].name;
        rowElement.appendChild(dataElement);
        dataElement = document.createElement('td');
        rowElement.appendChild(dataElement);
        dataElement = document.createElement('td');
        dataElement.id = 'amountOwed';
        dataElement.textContent = bills[i].roommates[j].amountOwed;
        rowElement.appendChild(dataElement);
        dataElement = document.createElement('td');

        individualBillTable.appendChild(rowElement);
      }

      function buildIndividualBillHeader(billToDisplay){
        var headings = ['Bill: ' + bills[billToDisplay].name + ' | ','Category: ' + bills[billToDisplay].category  + ' | ' , 'Amount Due | '];
        var rowElement = document.createElement('tr');
        for (var i = 0; i < headings.length; i++){
          var headElement = document.createElement('th');
          headElement.textContent = headings[i];
          rowElement.appendChild(headElement);
        }
        headElement = document.createElement('th');
        headElement.textContent = 'Close';
        headElement.setAttribute('id', 'closeBox');
        rowElement.appendChild(headElement);
        individualBillTable.appendChild(rowElement);
      }
    }
  }
  var closeBox = document.getElementById('closeBox');
  closeBox.addEventListener('click', function(){
    individualBillTable.innerHTML = '';
  });
}
fillBillTable();
