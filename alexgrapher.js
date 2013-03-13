// Graph a function upon the user's command
function graph() {

	// Store the element for the HTML5 canvas
	var element = document.getElementById("canvas");
	var ctx = element.getContext("2d");

	// Store the canvas's width and height
    var width = element.width;
    var height = element.height;
	
	// Parse the user's input equation into an AST node
	var node = parse();
	if(node == null)
		return;

	// Create an array to store the roots and corresponding linked lists
	var rtable = new Array();

	// Loop through each pixel on the canvas
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {

			// Convert this pixel to a complex coordinate
			var coord = pixelToComplex(x, y, 500, 500, new Complex(-10,-10), new Complex(10,10));
			
			// Iterate this complex point, and store the resultant root
			var itpoint = iterate(node, coord);
			if(itpoint == null || itpoint[0] == null)
				continue;
			var root = itpoint[0];
			
			// Round the data inside of the root
			root.real = Math.round(root.real * 1000) / 1000;
			root.imag = Math.round(root.imag * 1000) / 1000;

			// Check if this root is present in the array
			var index = -1;
			for(var i = 0; i < rtable.length; i++) {
				// Store the root at the current location
				var pair = rtable[i];
				var temp = pair[0];
				// Check for a match
				if(temp.real == root.real && temp.imag == root.imag) {
					index = i;
					break;
				}
			}
			
			// Check to see if root was not found
			if(index == -1) {
				index = rtable.length;
				rtable.push([root, null]);
			}
			
			// Store the other linked list
			var ppair = rtable[index];
			var llist = ppair[1];
			rtable[index] = [root, new LLNode([ x, y, itpoint[1] ], llist)];
		
		}
	}
	
	// Create a new pixel array
	var imageData = ctx.createImageData(width, height);
	
	// Create an array to store the min and max number of iterations needed to reach a root
	var iterRange = new Array(rtable.length);
	
	// TODO: Add coloring/drawing code here!
		// Process the root table and color pixels
	for(var i = 0; i < rtable.length; i++) {
		
		// Store the pair
		var tpair = rtable[i];
		
		// Set the default min and max number of iterations
		var min = 0;
		var max = 0;
		
		// Loop through the linked list
		var ltlist = tpair[1];
		// tpair[1] is an LLNode
		while(ltlist != null) {
		
			// Store x and y coordinates
			var tx = ltlist.data[0];
			var ty = ltlist.data[1];
			
			// Store the number of iterations taken
			var iter = ltlist.data[2];
			if(iter > max)
				max = iter;
			if(iter < min)
				min = iter;
		
			// Move to next linked list member
			ltlist = ltlist.next;
		
		}
		
		// Store the min and max
		iterRange[i] = [min, max];
		//document.write(iterRange[i] + "\t");
	}
	
	// Loop through the pixels stored in the root table and set their brightnesses
	for(var i = 0; i < rtable.length; i++) {

		// Store the pair
		var tpair = rtable[i];
		
		// Loop through the linked list
		var ltlist = tpair[1];
		// tpair[1] is an LLNode
		while(ltlist != null) {
		
			// Store x and y coordinates
			var tx = ltlist.data[0];
			var ty = ltlist.data[1];
			
			// Store the number of iterations taken
			var iter = ltlist.data[2];
			// document.write(iter + "\t");
			
			// Compute the relative brightness
			var min = iterRange[i][0];
			var max = iterRange[i][1];
			var tbright = Math.round( 255 * (iter - min) / (max - min) );
			//document.write(bright + "\t");
			
			// TODO: Change this so it's a color rotator with something like twenty predefined colors
			r = 0;
			g = 0;
			b = 0;
			if(i % 20 == 0)
				r = 255;
			if(i % 20 == 1)
				g = 255;
			if(i % 20 == 2)
				b = 255;
			if(i % 20 == 3) {
				r = 194; 
				g = 10;
				b = 255;
			}
			if(i % 20 == 4) {
				r = 117; 
				g = 255;
				b = 71;
			}
			if(i % 20 == 5) {
				r = 102; 
				g = 0;
				b = 204;
			}
			if(i % 20 == 6) {
				r = 255; 
				g = 10;
				b = 133;
			}
			if(i % 20 == 7) {
				r = 255; 
				g = 149;
				b = 122;
			}
			if(i % 20 == 8) {
				r = 122; 
				g = 228;
				b = 255;
			}
			if(i % 20 == 9) {
				r = 0; 
				g = 153;
				b = 26;
			}
			if(i % 20 == 10) {
				r = 255; 
				g = 255;
				b = 52;
			}
			if(i % 20 == 11) {
				r = 0; 
				g = 184;
				b = 184;
			}
			if(i % 20 == 12) {
				r = 255; 
				g = 204;
				b = 204;
			}
			if(i % 20 == 13) {
				r = 204; 
				g = 204;
				b = 255;
			}
			if(i % 20 == 14) {
				r = 153; 
				g = 77;
				b = 0;
			}
			if(i % 20 == 15) {
				r = 0; 
				g = 184;
				b = 184;
			}
			if(i % 20 == 16) {
				r = 51; 
				g = 255;
				b = 204;
			}
			if(i % 20 == 17) {
				r = 184; 
				g = 0;
				b = 0;
			}
			if(i % 20 == 18) {
				r = 117; 
				g = 255;
				b = 71;
			}
			if(i % 20 == 19) {
				r = 255; 
				g = 102;
				b = 51;
			}
			if(i % 20 == 20) {
				r = 51; 
				g = 204;
				b = 255;
			}
			
			
				
			setPixel(imageData, tx, ty, r, g, b, 255 - tbright * 2); // 255 opaque
		
			// Move to next linked list member
			ltlist = ltlist.next;
		
		}

	}
	
	// Draw the polynomiograph to the screen
	ctx.putImageData(imageData, 0, 0);
	
}

// Given the x and y coordinates of a pixel on the canvas,
// Convert to a corresponding complex coordinate
// x and y are integers
// w and h are width and height in pixels of canvas
// topLeft and bottomRight are complex
function pixelToComplex(x, y, w, h, topLeft, bottomRight) {

	if(w <= 1 || h <= 1)
		return null;

	// Calculate height and width of viewport
	var vWidth = bottomRight.real - topLeft.real;
	var vHeight = topLeft.imag - bottomRight.imag;
	
	// Calculate real and imaginary components
	var real = ( x / ( w - 1 ) ) * vWidth + topLeft.real;
	var imag = ( ( h - 1 - y ) / ( h - 1 ) ) * vHeight + bottomRight.imag;

	return new Complex(real, imag);
	
}

// Set the pixel in the given pixel array
function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
	if(a > 255)
		a = 255;
    imageData.data[index+3] = a;
}

// Given a node for f(x) and a complex value,
// Calculate how many iterations are needed to reach root
// Returns null if iteration does not converge
// Return pair of [root, number of iterations] otherwise
function iterate(node, value) {

	var iter1 = null;
	var iter2 = value;
	var diff = 1e-10;
	for(var count = 0; count < 100; count++) {
		iter1 = iter2;
		iter2 = newton(node, iter2);
		if(distance(iter1, iter2) <= diff)
			return [iter2, count];
	}
	
	// Did not converge!
	return null;

}

// Given a node for f(x) and a complex value,
// Calculate a single iteration of newton's method
function newton(node, value) {
	var num1 = evaluate(node, value);
	var num2 = deriv(node, value);
	var frac = Complex.divide(num1, num2);
	return Complex.subtract(value, frac);
}

// Given a node for f(x) and a complex value,
// Evaluate f'(x)
function deriv(node, value) {

	// Calculate delta
	var dist = distance(value, new Complex(0, 0));
	var EPSILON = 2.220446049250313e-16;
	var delta = Math.sqrt(EPSILON) * dist;

	// Calculate derivative by limit definition
	var mval = new Complex(value.real + delta, value.imag + delta);
	var num1 = evaluate(node, mval);
	var num2 = evaluate(node, value);
	var result = Complex.divide( Complex.subtract(num1, num2), new Complex(delta, delta) );
	return result;
	
}

// Given two Complex numbers,
// Return a decimal representing the
// distance between them.
function distance(a, b) {
	if(a == null || b == null)
		return null;
	var rdist = a.real - b.real;
	var idist = a.imag - b.imag;
	return Math.sqrt(rdist * rdist + idist * idist);
}

// Evaluate the AST given by the parent node
// Assume z = value is a number
// Return null if an error occurs
// Return a complex number otherwise
function evaluate(node, value) {

	if(node == null || value == null)
		return null;

	// Addition
	if(node.data == "+") {
		var left	= evaluate(node.left, value);
		var right	= evaluate(node.right, value);
		return Complex.add(left, right);
	}
	
	// Subtraction
	if(node.data == "-") {
		var left	= evaluate(node.left, value);
		var right	= evaluate(node.right, value);
		return Complex.subtract(left, right);
	}

	// Multiplication
	if(node.data == "*") {
		var left	= evaluate(node.left, value);
		var right	= evaluate(node.right, value);
		return Complex.multiply(left, right);
	}
	
	// Division
	if(node.data == "/") {
		var left	= evaluate(node.left, value);
		var right	= evaluate(node.right, value);
		return Complex.divide(left, right);
	}

	// Exponentiation
	if(node.data == "^") {
		var left	= evaluate(node.left, value);
		var right	= evaluate(node.right, value);
		return Complex.exponent(left, right);
	}
	
	// Variable substitution
	if(node.data == "z")
		return value;

	// Imaginary number
	if(node.data == "i")
		return new Complex(0, 1);
	
	// Process the argument as a number
	if(isNaN(node.data)) {
		document.write("ERROR!");
		return null;
	}
	
	// A real number
	return new Complex(parseFloat(node.data), 0);
		
}
