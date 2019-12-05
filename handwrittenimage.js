class HandWrittenImage {

  constructor(){

    this.canvas = document.getElementById('canvas');
    this.text = document.getElementById('answer');
    this.canvasWidth  = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.ctx = canvas.getContext('2d');

    this.imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    this.pixels = this.imageData.data;


  }

  draw(gues = '_'){

    this.text.textContent = "hmm... I'm thinking its a: " + gues + "?";

    for (let y = 0; y < this.canvasHeight; ++y) {
        for (let x = 0; x < this.canvasWidth; ++x) {

            let index = (y * this.canvasWidth + x) * 4;

            this.pixels[index]   = this.data[x * this.canvasWidth + y];	// red
            this.pixels[++index] = this.data[x * this.canvasWidth + y];	// green
            this.pixels[++index] = this.data[x * this.canvasWidth + y];	// blue

            this.pixels[++index] = 255;	// alpha
     }
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  refresh(imagejson){
    this.answer = Object.keys(imagejson)[0];
    this.data = imagejson[this.answer];
    this.draw();
  }

  getAnswer(){
    return parseInt(this.answer);
  }
}
