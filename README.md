# neural-network
an implementation of a neural network in javascript.
The network, once trained is able to recognize hand written images from the MNIST database. 

### About the network
This neural network has two hidden layers. The activation function on all nodes are sigmoid. The training is stochastic, in that the weights and biases are updated on each training example. Options for batch and mini-batch training should be added in the future.

### About the files
These are the important ones.

* **neuralnetwork.js** is the main code for the neural network. This is responsible for- forward propagation and backpropagation.

* **handwrittenimage.js** is drawing the pixel array of a given training example to the HTML canvas. It is also gets the correct value for the image, used when training the network.

* **mathlib.js** is a home-brewed matrix library with the bare minimum for this project.

* **imageparser.js** parses a specified number of images from the MNIST database into a JSON format that can be loaded in the browser, i.e. parsedImages.json.

* **main.js** binds it all together.
