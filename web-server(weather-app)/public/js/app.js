console.log("hello");

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const message1 = document.querySelector("#message-1");
const message2 = document.querySelector("#message-2");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const address = search.value;
  message1.textContent = "Loading...";
  message2.textContent = "";
  console.log(address);
  fetch("/weather?address=" + address).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        message1.textContent = data.error;
      } else {
        message1.textContent = data.place;
        message2.textContent = data.data;
      }
    });
  });
});
