// Class Complex is used to represent a complex number

// Constructor
function Complex(real, imag) {
	this.real = real;
	this.imag = imag;
}

// String representation
Complex.prototype.toString = function() {
	return "" + this.real + " + " + this.imag + "i";
}

// Add two complex numbers
Complex.add = function(a, b) {
	if(a == null || b == null)
		return null;
	var r_real = a.real + b.real;
	var r_imag = a.imag + b.imag;
	return new Complex(r_real, r_imag);
}

// Subtract two complex numbers
Complex.subtract = function(a, b) {
	if(a == null || b == null)
		return null;
	var r_real = a.real - b.real;
	var r_imag = a.imag - b.imag;
	return new Complex(r_real, r_imag);
}

// Multiply two complex numbers
Complex.multiply = function(a, b) {
	if(a == null || b == null)
		return null;
	var r_real = (a.real * b.real) - (a.imag * b.imag);
	var r_imag = (a.imag * b.real) + (a.real * b.imag);
	return new Complex(r_real, r_imag);
}

// Divide two complex numbers
Complex.divide = function(a, b) {

	if(a == null || b == null)
		return null;
		
	var lnum = (a.real * b.real) + (a.imag * b.imag);
	var rnum = (a.imag * b.real) - (a.real * b.imag);
	var denom = b.real * b.real + b.imag * b.imag;
	
	if(denom == 0)
		return null;
		
	return new Complex(lnum / denom, rnum / denom);
	
}

// Compute the complex argument
Complex.prototype.argument = function() {
	return Math.atan(this.imag / this.real);
}

// Compute an exponent
Complex.exponent = function(a, b) {

	if(a == null || b == null)
		return null;

	// Check for 0^0
	if((a.real == 0 && a.imag == 0) && (b.real == 0 && b.imag == 0))
		return null;
		
	// Check for 0^b
	if(a.real == 0 && a.imag == 0)
		return new Complex(0, 0);

	// Check for a complex power
	if(b.imag != 0)
		return null;
	
	// Check for a zero power
	if(b.real == 0)
		return new Complex(1, 0);
	
	// Check for a negative power
	if(b.real < 0)
		return null;
	
	// Compute the product
	var result = new Complex(1, 0);
	for(var i = 0; i < b.real; i++) {
		result = Complex.multiply(result, a);
	}
	return result;

	// Compute a^b
	//var arg = a.argument();
	//var dist = Math.pow(a.real * a.real + a.imag * a.imag, b.real / 2) * Math.pow(Math.E, -b.imag * arg);
	//var angle = b.real * arg + 0.5 * b.imag * Math.log(a.real * a.real + a.imag * a.imag);
	//return new Complex(dist * Math.cos(angle), dist * Math.sin(angle));

}
