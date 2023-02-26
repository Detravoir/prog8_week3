const label = document.getElementById("label");
const loading = document.getElementById("loading");
const classifier = ml5.imageClassifier('model.json', modelLoaded);

function modelLoaded() {
  loading.innerText = "Model loaded!";
}

let synth = window.speechSynthesis;

function speak(text){
  if (synth.speaking){
    console.log('still speaking');
    return;
  }
  if (text !== ''){
    let utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);
  }
}

// Listen for when the user selects an image
const inputElement = document.getElementById("image");
inputElement.addEventListener("change", (e) => {
  const imageFile = e.target.files[0];

  // Remove the previously uploaded image element
  const imageContainer = document.getElementById("image-container");
  const lastUploadedImage = imageContainer.lastElementChild;
  if (lastUploadedImage) {
    imageContainer.removeChild(lastUploadedImage);
  }

  // Create a new image element and set the source to the selected file
  const img = new Image();
  img.src = URL.createObjectURL(imageFile);

  // When the image is loaded, classify the image and update the label
  img.onload = () => {
    classifier.classify(img, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      label.innerText = `Prediction: ${results[0].label} (${results[0].confidence.toFixed(2)})`;
      if (label.innerText.includes("raccoon")){
        speak("raccoon");
      } else if(label.innerText.includes("cat")){
        speak("cat");
      }
    });
  };



  // Add the image element to the DOM
  const uploadedImage = document.createElement("img");
  uploadedImage.src = URL.createObjectURL(imageFile);
  imageContainer.appendChild(uploadedImage);
});