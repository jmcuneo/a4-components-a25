const http = require("http"),
      fs   = require("fs"),
      mime = require("mime"),
      dir  = "public/",
      port = 3000;


let appdata = [
  {
    "id": "user_1",
    "name": "Alex Chen",
    "weight": 55,
    "height": 1.75,
    "bmi": 17.96,
    "healthiness": "Underweight"
  },
  {
    "id": "user_2",
    "name": "Maria Garcia",
    "weight": 67,
    "height": 1.75,
    "bmi": 21.88,
    "healthiness": "Healthy Weight"
  },
  {
    "id": "user_3",
    "name": "David Smith",
    "weight": 83,
    "height": 1.75,
    "bmi": 27.1,
    "healthiness": "Overweight"
  },
  {
    "id": "user_4",
    "name": "Chris Jones",
    "weight": 95,
    "height": 1.75,
    "bmi": 31.02,
    "healthiness": "Obese"
  }
];

const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  } else if (request.method === "PUT") {
    handlePut(request, response);
  }
});

const handleGet = function(request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/appdata") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function(request, response) {
  let dataString = "";

  request.on("data", function(data) {
    dataString += data;
  });

  request.on("end", function() {
    const userInput = JSON.parse(dataString);
    let weight = parseFloat(userInput.weight);
    let height = parseFloat(userInput.height);
    const weightUnit = userInput.weightUnit;
    const heightUnit = userInput.heightUnit;

    if (isNaN(weight) || isNaN(height) || height <= 0) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid weight or height" }));
      return;
    }
    
    if (weightUnit === "lbs") {
      weight = (weight * 0.453592).toFixed(2); // Convert pounds to kg
    }
    if (heightUnit === "ft") {
      height = (height * 0.3048).toFixed(2); // Convert feet to meters
    }

    const bmi = parseFloat((weight / (height * height)).toFixed(2));

    let healthiness = "";
    if (bmi < 18.5) {
      healthiness = "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      healthiness = "Healthy Weight";
    } else if (bmi >= 25 && bmi < 30) {
      healthiness = "Overweight";
    } else {
      healthiness = "Obese";
    }

    // Create the full data object
    const newEntry = {
      id: `user_${Date.now()}`, // Add a unique ID (Current Date/Timestamp should always be unique)
      name: userInput.name,
      weight: weight,
      height: height,
      bmi: bmi,
      healthiness: healthiness
    };

    appdata.push(newEntry);
    console.log("Added new entry:", newEntry);

    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify(newEntry));
  });
};

const handleDelete = function(request, response) {
  //  /appdata/user_1725301800000
  const urlParts = request.url.split('/');
  const idToDelete = urlParts[2];

  // Filter out the one with the matching ID
  appdata = appdata.filter(item => item.id !== idToDelete);

  console.log("Deleted item with ID:", idToDelete);
  response.writeHead(204); // 204 No Content - standard for successful delete
  response.end();
  
};

const handlePut = function(request, response) {
  const urlParts = request.url.split('/');
  const idToUpdate = urlParts[2];
  let dataString = "";

  request.on("data", data => { dataString += data; });

  request.on("end", () => {
    const updatedData = JSON.parse(dataString);
    
    const itemIndex = appdata.findIndex(item => item.id === idToUpdate);

    if (itemIndex === -1) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Item not found" }));
      return;
    }

    const originalItem = appdata[itemIndex];
    const updatedItem = { ...originalItem, ...updatedData };

    // Recalculate BMI and Healthiness
    const { weight, height } = updatedItem;
    const bmi = parseFloat((weight / (height * height)).toFixed(2));
    let healthiness = "";
    if (bmi < 18.5) healthiness = "Underweight";
    else if (bmi < 25) healthiness = "Healthy Weight";
    else if (bmi < 30) healthiness = "Overweight";
    else healthiness = "Obese";
    
    updatedItem.bmi = bmi;
    updatedItem.healthiness = healthiness;

    appdata[itemIndex] = updatedItem;

    console.log("Updated item:", updatedItem);
    
    // Send back to the client
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(updatedItem));
  });
};

const sendFile = function(response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function(err, content) {
    if (err === null) {
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHead(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
console.log("BMI Simulator server running on port", port);