const video = document.getElementById("video");
const videoStatus = document.getElementById("videoStatus");
const loading = document.getElementById("loading");
const catButton = document.getElementById("catButton");
const dogButton = document.getElementById("dogButton");
const amountOfCatImages = document.getElementById("amountOfCatImages");
const amountOfDogImages = document.getElementById("amountOfDogImages");
const train = document.getElementById("train");
const loss = document.getElementById("loss");
const result = document.getElementById("result");
const confidence = document.getElementById("confidence");
const predict = document.getElementById("predict");

const label = document.getElementById("label");

const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const labelThreeBtn = document.querySelector("#labelThree");
const trainbtn = document.querySelector("#train");

labelOneBtn.addEventListener("click", () => console.log("button 1"));
labelTwoBtn.addEventListener("click", () => console.log("button 2"));
labelThreeBtn.addEventListener("click", () => console.log("button 3"));

trainbtn.addEventListener("click", () => console.log("train"));

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
          video.srcObject = stream;
      })
      .catch((err) => {
          console.log("Something went wrong!");
      });
}

label.innerText = "Ready when you are!";

// A variable to store the total loss
let totalLoss = 0;

// Create a webcam capture
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
  video.play();
});

// A function to be called when the model has been loaded
function modelLoaded() {
  loading.innerText = "Model loaded!";
}

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor("MobileNet", modelLoaded);
// Create a new classifier using those features
const classifier = featureExtractor.classification(video, videoReady);

// A function to be called when the video is finished loading
function videoReady() {
  videoStatus.innerText = "Video ready!";
}

// When the Cat button is pressed, add the current frame
// from the video with a label of cat to the classifier
catButton.onclick = function() {
  classifier.addImage("cat");
  amountOfCatImages.innerText = Number(amountOfCatImages.innerText) + 1;
};

// When the Cat button is pressed, add the current frame
// from the video with a label of cat to the classifier
dogButton.onclick = function() {
  classifier.addImage("dog");
  amountOfDogImages.innerText = Number(amountOfDogImages.innerText) + 1;
};

// When the train button is pressed, train the classifier
// With all the given cat and dog images
train.onclick = function() {
  classifier.train(function(lossValue) {
    if (lossValue) {
      totalLoss = lossValue;
      loss.innerHTML = `Loss: ${totalLoss}`;
    } else {
      loss.innerHTML = `Done Training! Final Loss: ${totalLoss}`;
    }
  });
};

// Show the results
function gotResults(err, results) {
  // Display any error
  if (err) {
    console.error(err);
  }
  if (results && results[0]) {
    result.innerText = results[0].label;
    confidence.innerText = results[0].confidence;
    classifier.classify(gotResults);
  }
}

// Start predicting when the predict button is clicked
predict.onclick = function() {
  classifier.classify(gotResults);
};
