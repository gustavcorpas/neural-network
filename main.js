window.addEventListener('DOMContentLoaded', (event) => {
  let jsondata = JSON.parse(imagedata);
  let trainingexample = 0;

  let image = new HandWrittenImage();
  let network = new NeuralNetwork();
   // image.refresh(jsondata[trainingexample++]);
  // network.run(image.data, image.getAnswer());

  for(let j = 0; j < 1000; j++){
    for(let i = 0; i < jsondata.length; i++){
      image.refresh(jsondata[trainingexample++]);
      network.run(image.data, image.getAnswer());
    }
    trainingexample = 0;
    // network.gradientStep();
  }



  let runbtn = document.querySelector('#runbtn');

  runbtn.addEventListener('click', e => {
    image.refresh(jsondata[trainingexample++]);
    let gues = network.run(image.data, image.getAnswer());
    image.draw(gues);
    if(trainingexample >= jsondata.length){
      trainingexample = 0;
    }
  });

});
