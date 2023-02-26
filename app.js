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

let score = 0;
const scoreElement = document.getElementById("score")

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
      if(results[0].confidence >= 0.80){
        score++;
        scoreElement.innerText = `Score: ${score}`;
      label.innerText = `Prediction: ${results[0].label} (${results[0].confidence.toFixed(2)})`;
      if (label.innerText.includes("raccoon")){
        speak("This is probably a raccoon!");
      } else if(label.innerText.includes("cat")){
        speak("This must be a cat.");
      }
    } else{
      speak("It looks like its neither a raccoon or a cat, or i am not trained enough");
    }
    });
  };

  // Add the image element to the DOM
  const uploadedImage = document.createElement("img");
  uploadedImage.src = URL.createObjectURL(imageFile);

  // Set the maximum width for the uploaded image
  const maxWidth = 500;

  // Resize the image if it exceeds the maximum width
  uploadedImage.onload = () => {
    if (uploadedImage.width > maxWidth) {
      const scaleFactor = maxWidth / uploadedImage.width;
      uploadedImage.width = maxWidth;
      uploadedImage.height = 400;
    }
  };

  imageContainer.appendChild(uploadedImage);
});