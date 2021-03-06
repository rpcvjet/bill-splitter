'use strict';

var roommates = [];
var loggedIn = localStorage.getItem('loggedInID');
var house = JSON.parse(localStorage.getItem(loggedIn));
roommates = house.roommates;
// if (localStorage.getItem('roommates')){
//   console.log('Fetching LS...');
//   roommates = JSON.parse(localStorage.getItem('roommates'));
// } else {
//   //there are no roommates in the list
// }

function Roommate(firstName, lastName, email){
  this.firstName = firstName;
  this.lastName = lastName;
  this.userID = ((firstName + lastName).toLowerCase()).replace(/[^a-zA-Z ]/g, '');
  this.email = email;
  this.unpaid = [];
  this.history = [];
  roommates.push(this);
}
var roommateDiv = document.getElementById('roommateDiv');
roommateDiv.addEventListener('click',handleRoommateBillList);
function handleRoommateBillList(event){
  console.log(event);
}
var roommateFieldset = document.getElementById('roommateFieldset');
roommateFieldset.addEventListener('click', handleFieldset);
function handleFieldset(event){
  var toHide = document.getElementById('toHide');
  console.log(event);
  if (event.target.nodeName === 'LEGEND'){
    console.log('here');
    if(toHide.style.display === 'none'){
      toHide.style.display = '';
    }
    else{
      toHide.style.display = 'none';
    }
  }
}

function display(){
  roommatesList.innerHTML = '';
  for (var i = 0; i < roommates.length; i++){
    var ulElement = document.getElementById('roommatesList');
    var lineElement = document.createElement('li');
    lineElement.textContent = roommates[i].firstName + ' ' + roommates[i].lastName + ' - Email: ' + roommates[i].email + ' ';
    lineElement.id = roommates[i].userID + 'a';
    var buttonElement = document.createElement('button');
    buttonElement.setAttribute('id', roommates[i].userID);
    buttonElement.setAttribute('class', 'removeRoommate');
    buttonElement.textContent = 'Remove';
    lineElement.appendChild(buttonElement);
    ulElement.appendChild(lineElement);
  }
  if (roommates.length > 0){
    ulElement.addEventListener('click', function(event) {
    //  console.log(event);
      var toRemove = event.target.id;
      for (var i = 0; i < roommates.length; i++){
        if (toRemove === roommates[i].userID){
          if (confirm('Are you sure you want to remove ' + roommates[i].firstName + ' from the roommates list?')){
            roommates.splice(i, 1);
            house.roommates = roommates;
            var toLocalStorage = JSON.stringify(house);
            localStorage.setItem(loggedIn,toLocalStorage);
            display();
          } else {
            //do nothing
          }
        }
      }
    });
  }
}

addRoomateForm.addEventListener('submit', function(event){
  // if (localStorage.getItem('roommates')){
  //   roommates = JSON.parse(localStorage.getItem('roommates'));
  // }
  event.preventDefault();
  if (!event.target.newFirstName.value || !event.target.newLastName.value || !event.target.newEmail.value){
    return alert('Must fill in all values');
  }
  for (var i = 0; i < roommates.length; i++){
    if ((event.target.newFirstName.value === roommates[i].firstName) && (event.target.newLastName.value === roommates[i].lastName)){
      return alert('Roommate already exists');
    }
    if(event.target.newEmail.value === roommates[i].email){
      return alert('Email already exists');
    }
  }
  var newRoommateFirstName = event.target.newFirstName.value;
  var newRoommateLastName = event.target.newLastName.value;
  var newRoommateEmail = event.target.newEmail.value;
  event.target.newFirstName.value = null;
  event.target.newLastName.value = null;
  event.target.newEmail.value = null;
  var newRoommate = new Roommate(newRoommateFirstName, newRoommateLastName, newRoommateEmail);
  console.log(newRoommate);
  house.roommates = roommates;
  var toLocalStorage = JSON.stringify(house);
  localStorage.setItem(loggedIn,toLocalStorage);
  // var arrayToStore = JSON.stringify(roommates);
  // localStorage.setItem('roommates',arrayToStore);
  display();
	location.reload();
});

display();

//Functions for testing/ not added to final
// function resetLS(){
//   localStorage.clear();
// }
//RLS.addEventListener('click', resetLS)
