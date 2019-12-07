class NeuralNetwork {
  // a neural network with 28*28 (784) input nodes, 2 hidden layers of 16 nodes, and output of 10 nodes
  lr = 0.05;
  // a vector of 28*28 pixels (784) in values [0;1]
  input = new Matrix(784, 1);
  answer = new Matrix(10,1);

  // hidden layer one, vector. | //weights in a matrix | biases in a vector
  hl1 = new Matrix(16, 1);
  wh1 = new Matrix(16, 784);
  bh1 = new Matrix(16, 1);
  // hidden layer two
  hl2 = new Matrix(16, 1);
  wh2 = new Matrix(16, 16);
  bh2 = new Matrix(16, 1);
  //output layer
  output = new Matrix(10, 1);
  wo = new Matrix(10, 16);
  bo = new Matrix(10, 1);

  arraydeltabiases = [];
  arraydeltaweights = [];

  constructor(){
    this.initialize();
  }

  run(input, answer){

    for(let i = 0; i < 784; i++){
      this.input.matrix[i][0] = input[i];
    }
    this.input.map(m => {
      if(m > 0) {
        return 1;
      }else {
        return 0;
      }
    });
    this.answer = new Matrix(10, 1);
    this.answer.matrix[answer][0] = 1;

    this.feedforward();
    console.log("gues: " +this.output.getBiggestNumber().index.row, "correct: " +this.answer.getBiggestNumber().index.row);
    console.log(this.calcError());

    this.backpropagate();

    return this.output.getBiggestNumber().index.row;
  }


  // initialize weights with random values ( randomize() from mathlib )
  initialize(){
    this.wh1.randomize();
    this.wh1.mult(0.05);
    this.wh2.randomize()
    this.wh2.mult(0.25);
    this.wo.randomize()
    this.wo.mult(0.277);
  }

  feedforward(){

    // DO LAYER 1
    this.hl1 = this.step(this.input, this.wh1, this.bh1);
    // DO LAYER 2
    this.hl2 = this.step(this.hl1, this.wh2, this.bh2);
    // DO OUTPUT LAYER
    this.output = this.step(this.hl2, this.wo, this.bo);
  }

  backpropagate(){

    // DO OUTPUT LAYER
    let newout = this.backtick(this.output, this.answer, this.bo, this.wo, this.hl2);
    this.bo = newout.biases;
    this.wo = newout.weights;
    // DO LAYER 2
    newout = this.backtick(this.hl2, newout.nodes, this.bh2, this.wh2, this.hl1);
    this.bh2 = newout.biases;
    this.wh2 = newout.weights;
    // DO LAYER 1
    newout = this.backtick(this.hl1, newout.nodes, this.bh1, this.wh1, this.input);
    this.bh1 = newout.biases;
    this.wh1 = newout.weights;

  }

  //HELPER FUNCTIONS **
  sigmoid(x){
    return 1 / (1 + Math.exp(-x));
  }
  dsigmoid(x){
    return x * (1 - x);
  }
  calcError(){
    // calc error
    let error = Matrix.subtract(this.output, this.answer);
    error.mult(1 / 2);
    error.map(m => Math.pow(m, 2));
    let e = Matrix.sumElements(error);

    return e;
  }


  step(input, weights, biases){
    // calculate nodes
    let nodes = Matrix.mult(weights, input);
    nodes.add(biases);

    // map to sigmoid squishification ( just mapping to values [0;1] )
    nodes.map(this.sigmoid);

    return nodes;
  }

  backtick(output, answer, biases, weights, prevnodes){

    // for weights
    let ew = Matrix.subtract(answer, output);
    let ow = Matrix.createFromMatrix(output);
    ow.map(this.dsigmoid);
    let xw = Matrix.createFromMatrix(prevnodes);
    xw = xw.transpose();
    ew.mult(ow);
    let deltaweights = ew;

    deltaweights = Matrix.mult(deltaweights, xw);
    deltaweights.mult(-this.lr);

    // for biases
    let eb = Matrix.subtract(answer, output);
    let ob = Matrix.createFromMatrix(output);
    ob.map(this.dsigmoid);
    eb.mult(ob);
    let deltabiases = eb;
    deltabiases.mult(-this.lr);

    // for nodes
    let en = Matrix.subtract(answer, output);
    let on = Matrix.createFromMatrix(output);
    on.map(this.dsigmoid);
    let xn = Matrix.createFromMatrix(weights);
    xn = xn.transpose();

    en.mult(on);
    let deltanodes = en;

    deltanodes = Matrix.mult(xn, deltanodes);
    // take an avarage of how all the nodes in current layer wish to change previos nodes
    for(let i = 0; i < deltanodes.rows; i++){
      for(let j = 1; j < deltanodes.cols; j++){
        deltanodes.matrix[i][0] += deltanodes.matrix[i][j];
      }
      deltanodes.matrix[i].length = 1;
    }
    let deltanodes_length = deltanodes.cols;
    deltanodes.cols = 1;
    deltanodes.mult(-1 / deltanodes_length);



    let newnodes = {
      nodes: Matrix.subtract(prevnodes, deltanodes),
      weights: Matrix.subtract(weights, deltaweights),
      biases: Matrix.subtract(biases, deltabiases)
    };


    return newnodes;

  }

  gradientStep(){
    //calc avarage of all bias matrixes
    for(let i = 0; i < this.arraydeltabiases.length / 3; i++){
      let o_index = i * 3
      let h2_index = (i * 3) + 1
      let h1_index = (i * 3) + 2

      this.arraydeltabiases[0].add(this.arraydeltabiases[o_index]);
      this.arraydeltabiases[1].add(this.arraydeltabiases[h2_index]);
      this.arraydeltabiases[2].add(this.arraydeltabiases[h1_index]);
    }
    this.arraydeltabiases[0].mult(1 / this.arraydeltabiases.length);
    this.arraydeltabiases[1].mult(1 / this.arraydeltabiases.length);
    this.arraydeltabiases[2].mult(1 / this.arraydeltabiases.length);
    //add avarages to biases in network
    this.bo.add(this.arraydeltabiases[0]);
    this.bh2.add(this.arraydeltabiases[1]);
    this.bh1.add(this.arraydeltabiases[2]);

    //calc avarage of all weights matrixes
    for(let i = 0; i < this.arraydeltaweights.length / 3; i++){
      let o_index = i * 3
      let h2_index = (i * 3) + 1
      let h1_index = (i * 3) + 2

      this.arraydeltaweights[0].add(this.arraydeltaweights[o_index]);
      this.arraydeltaweights[1].add(this.arraydeltaweights[h2_index]);
      this.arraydeltaweights[2].add(this.arraydeltaweights[h1_index]);
    }
    this.arraydeltaweights[0].mult(1 / this.arraydeltaweights.length);
    this.arraydeltaweights[1].mult(1 / this.arraydeltaweights.length);
    this.arraydeltaweights[2].mult(1 / this.arraydeltaweights.length);
    //add avarages to biases in network
    this.wo.add(this.arraydeltaweights[0]);
    this.wh2.add(this.arraydeltaweights[1]);
    this.wh1.add(this.arraydeltaweights[2]);


    console.log("gues: " +this.output.getBiggestNumber().index.row, "correct: " +this.answer.getBiggestNumber().index.row);
    console.log(this.calcError());


    this.arraydeltabiases = [];
    this.arraydeltaweights = [];

  }


}
