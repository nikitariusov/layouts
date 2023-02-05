"use strict";

const tabItems = document.querySelectorAll(".tabs__btn-item");
const tabContents = document.querySelectorAll(".tabs__content-item");

tabItems.forEach(function (element) {
  element.addEventListener("click", open, false);
});

function open(e) {
  const tabTarget = e.currentTarget
  const buttonContentId = tabTarget.dataset.button

  tabItems.forEach(function(elem){
    elem.classList.remove('tabs__btn-item--active')
  })

  tabContents.forEach(function(elem){
    elem.classList.remove('tabs__content-item--active')
  })

  tabTarget.classList.add('tabs__btn-item--active')
  document.querySelector(`#${buttonContentId}`).classList.add('tabs__content-item--active')
}
