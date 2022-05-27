const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)
// Promise.all runs all the async call in parallel which makes it quicker to run
// tinyFaceDetector runs quicker
// faceRecognition finds the box around your face to create the constraints

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  // getUserMedia takes in a couple arguments, the first being an object
  // the first object is our video key which we set to an empty object
  // second is a method which will be getting the source of the webcam
  // third is just an error catch
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
// adding an event listener to when the video starts playing to start running the detection every 100 milliseconds 
// TinyFaceDetectorOptions() can take in custom options if you want
// note that TinyFaceDetectorOptions is capitalized, if you don't capitalize it you will get an error that it is not a constructor 
// detections will return multiple objects 
// displaySize makes sure that our canvas is the same size as the video element
// resizedDetections is making sure that our video size and canvas size are sized property so all the detections line up properly 
// canvas.getContext is to clear the canvas so it stops loading on top of itself constantly
// faceapi.matchDimensions is to make sure that the faceapi can match the canvas size