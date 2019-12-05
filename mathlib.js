class Matrix {
  constructor(rows = 2, cols = 2){
    this.rows = rows;
    this.cols = cols;
    this.matrix = [];

    this.initialize();
  }

  initialize(){
    for(let i = 0; i < this.rows; i++){
      this.matrix[i] = [];
      for(let j = 0; j < this.cols; j++){
        this.matrix[i][j] = 0;
      }
    }
  }

  randomize(min = -1, max = 1){
    this.map(m => m =  Math.random() * (+max - +min) + +min );
  }

  //OPERATIONS **

  static mult(a, b){
    if(a.cols !== b.rows){
      console.log("Collums of matrix a must match rows of matrix b");
      return undefined;
    }
    //matrix mult (i.e. dot product of row and col vectors). Also.. really confusing.
    let result = new Matrix(a.rows, b.cols);
    for(let i = 0; i < result.rows; i++){
      for(let j = 0; j < result.cols; j++){
        let sum = 0;
        for(let k = 0; k < b.rows; k++){
          sum += a.matrix[i][k] * b.matrix[k][j];
        }
        result.matrix[i][j] = sum;
      }
    }
    return result;
  }

  mult(n){
    if(typeof n == 'number'){
      //Scaler mult
      this.map(m => m *= n);
    }
    else if(n instanceof Matrix){
      //hadamard product
      this.map((m, i, j) => m *= n.matrix[i][j]);
    }

  }

  add(n){
    if(typeof n == 'number'){
      this.map(m => m += n);
    }
    else if(n instanceof Matrix){
      this.map((m, i, j) => m += n.matrix[i][j]);
    }
  }

  static subtract(m1, m2){
    let result = new Matrix(m1.rows, m1.cols);
    for(let i = 0; i < result.rows; i++){
      for(let j = 0; j < result.cols; j++){
        result.matrix[i][j] = m1.matrix[i][j] - m2.matrix[i][j];
      }
    }
    return result;
  }

  static sumElements(m1){
    let sum = 0;
    for(let i = 0; i < m1.rows; i++){
      for(let j = 0; j < m1.cols; j++){
        sum += m1.matrix[i][j];
      }
    }
    return sum;
  }

  transpose(){
    let result = new Matrix(this.cols, this.rows);
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        result.matrix[j][i] = this.matrix[i][j];
      }
    }
    return result;
  }

  // HELPER FUNCTIONS

  map(func){
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        this.matrix[i][j] = func(this.matrix[i][j], i, j);
      }
    }
  }

  getBiggestNumber(){
    let number;
    let index;
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        if(!number || this.matrix[i][j] > number){
          number = this.matrix[i][j];
          index = {row: i, col: j};
        }
      }
    }
    return {index, number};
  }

  static createFromMatrix(m){
    let result = new Matrix(m.rows, m.cols);
    for(let i = 0; i < result.rows; i++){
      for(let j = 0; j < result.cols; j++){
        result.matrix[i][j] = m.matrix[i][j];
      }
    }
    return result;
  }


  print(string = ""){
    console.log(string);
    console.table(this.matrix);
  }

}
