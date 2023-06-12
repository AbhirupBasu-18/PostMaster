//Parameter Box is hidden initially when app starts
let parameterbox = document.getElementsByClassName("parameter-box")[0];
parameterbox.style.display = "none";

//if user clicks on params box,hide the json box

let clickParams = document.getElementById("Custom");
clickParams.addEventListener("click", function () {
  let jsonbox = document.getElementById("JSONRequestBox");
  jsonbox.style.display = "none";
  parameterbox.style.display = "block";
  document.getElementById("params").style.display = "block";
});

//if user clicks on json box,hide the param box

let clickJSON = document.getElementById("json");
clickJSON.addEventListener("click", () => {
  let jsonbox = document.getElementById("JSONRequestBox");
  document.getElementsByClassName("parameter-box")[0].style.display = "none";
  document.getElementById("params").style.display = "none";
  jsonbox.style.display = "block";
});

//To get DOM element from string

function getElementFromString(string) {
  let div = document.createElement("div");
  div.innerHTML = string;
  return div.firstElementChild;
}

//user click on add button,add more parameters
let addButton = document.getElementById("button1");

let cnt = 1;

addButton.addEventListener("click", () => {
  let param = document.getElementById("params");
  cnt++;
  let string = `<div class="row my-2 hi">
        <label for="text" class="col-sm-2 col-form-label">Parameter</label>
        <div class="col-md-4">
        <input type="text" class="form-control hi" id="ParameterKey${cnt}" placeholder="Enter Parameter  key" aria-label="First name">
        </div>
        <div class="col-md-4 hi">
        <input type="text" class="form-control" id="ParameterValue${cnt}" placeholder="Enter Parameter Value" aria-label="Last name">
        </div>
        <button class="btn col-md-1 hi deleteparam" id="button${cnt}">-</button>
    </div>`;
  //Convert string to DOM node
  let paramElement = getElementFromString(string);
  param.append(paramElement);
  //add event listener to remove button
  let x = document.getElementById(`button${cnt}`);
  x.addEventListener("click", (e) => {
    //console.log(e.target);
    if (confirm("Do u want to delete") == true) {
      //console.log(e.target);
      e.target.parentElement.remove();
    }
  });
});

//If user clicks on submit button
var submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  //Showing wait in response box

  document.getElementById("Responsetext").innerHTML =
    "Please wait... Fetching Response...";

  //fetch all value user has entered

  let url = document.getElementById("urlform").value;
  let requestType = document.querySelector(
    'input[name="RequestType"]:checked'
  ).value;
  let contentType = document.querySelector(
    'input[name="ContentType"]:checked'
  ).value;

  //log values
  //console.log(url);
  // console.log(requestType);
  // console.log(contentType);

  //if user has used params option,instead of json,collect all parameters in object
  data = {};
  if (contentType == "CUSTOM") {
    for (let i = 0; i < cnt; i++) {
      if (document.getElementById("ParameterKey" + (i + 1)) != undefined) {
        let key = document.getElementById("ParameterKey" + (i + 1)).value;
        let value = document.getElementById("ParameterValue" + (i + 1)).value;
        if ((key.trim() == "" || value.trim() == "") && requestType!="GET") {
          alert("Key and Value should not be blank");
          document.getElementById("Responsetext").innerHTML =
        "Your response will appear here";
          return;
        }
        data[key] = value;
      }
    }
    data = JSON.stringify(data);
  } else {
    data = document.getElementById("requestJsonText").value;
  }
  //if the request type is get,invoke the api to create get
  if (requestType == "GET") {
    //check url is blank or not
    if (url.trim() == "") {
      alert("Wrong URL");
      document.getElementById("Responsetext").innerHTML =
        "Your response will appear here";
    } else {
      fetch(url, {
        method: "GET",
      })
        .then(function (response) {
          //console.log(response);
          if (response.status == 200) {
            return response.text();
          }
          //console.log("hi");
          throw "Request Failed.Fill all details properly";
        })
        .then((text) => {
          // document.getElementById('responseJsonText').value = text;
          document.getElementById("Responsetext").innerHTML = text;
          Prism.highlightAll();
        })
        .catch((error) => {
          //console.log(error);
          alert(error);
          document.getElementById("Responsetext").innerHTML =
            "Your response will appear here";
        });
    }
  } //if the request type is post,invoke the api to create post api
  else {
    //check url is blank or not
    if (url.trim() =="") {
      alert("Wrong URL");
      document.getElementById("Responsetext").innerHTML =
        "Your response will appear here";
    } else {
      fetch(url, {
        method: "POST",
        body: data, //we pass data using string only
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(function (response) {
          console.log(response);
          if (response.status == 200 || response.status == 201) {
            return response.text();
          }
          throw "Request Failed.Fill all details properly";
        })
        .then((text) => {
          // document.getElementById('responseJsonText').value = text;
          document.getElementById("Responsetext").innerHTML = text;
          Prism.highlightAll();
        })
        .catch((e) => {
          alert(e);
          document.getElementById("Responsetext").innerHTML =
            "Your response will appear here";
        });
    }
  }
});
