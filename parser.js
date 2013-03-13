// Class parser is used to parse a given polynomial

// Create a node for the abstract syntax tree
function Node(data, left, right) {
	this.data = data;
	this.left = left;
	this.right = right;
}

// Tokenize a given string into an array of string tokens
function tokenize(expr) {

	var tokens = new Array();
	var tok = "";

	for(var i = 0; i < expr.length; i++) {

		// Store the current character
		var c = expr.charAt(i);

		// Tokenize operators
		if(c == '+' || c == '-' || c == '(' || c == ')' || c == '*' || c == '/' || c == '^') {
			if(tok != "") {
				tokens.push(tok);
				tok = "";
			}
			tokens.push(c);
			continue;
		}
		
		// Skip whitespace
		if(c == ' ') {
			if(tok != "") {
				tokens.push(tok);
				tok = "";
			}
			continue;
		}
			
		// Append the character to the word
		tok = tok + c;
		
	}
	
	// Handle last token
	if(tok != "")
		tokens.push(tok);
		
	return tokens;
	
}

// Parse the input string
// Return a parent Node of the AST
function parse() {

	// Store the expression string read from a text field
	var expr = document.inform.poly.value;
	
	// Tokenize the expression
	var tokens = tokenize(expr);

	// Begin parsing the tokens
	var result = parseEXPR1(tokens);
	
	// Check for errors
	if(result == null || tokens.length != 0) {
		document.write("Malformed expression!");
		return;
	}

	return result;
}

function parseEXPR1(tokens) {

	// Parse sub-expression
	var result = parseEXPR2(tokens);

	// Check for error
	if(result == null)
		return null;

	// expr1 -> expr2 + expr2
	// expr1 -> expr2 - expr2
	while(tokens.length != 0 && (tokens[0] == "+" || tokens[0] == "-")) {

		// Store the first token
		var tok = tokens.shift();

		// Parse sub-expression
		var sexpr = parseEXPR2(tokens);

		// Check for error
		if(sexpr == null)
			return null;		

		result = new Node(tok, result, sexpr);
		
	}
	
	return result;

}

function parseEXPR2(tokens) {

	// Parse sub-expression
	var result = parseEXPR3(tokens);

	// Check for error
	if(result == null)
		return null;

	// expr2 -> expr3 * expr3
	// expr2 -> expr3 / expr3
	while(tokens.length != 0 && (tokens[0] == "*" || tokens[0] == "/")) {

		// Store the first token
		var tok = tokens.shift();

		// Parse sub-expression
		var sexpr = parseEXPR2(tokens);

		// Check for error
		if(sexpr == null)
			return null;		

		result = new Node(tok, result, sexpr);
		
	}
	
	return result;

}

function parseEXPR3(tokens) {

	// Parse sub-expression
	var result = parseEXPR4(tokens);

	// Check for error
	if(result == null)
		return null;

	// expr3 -> expr4 ^ expr3
	while(tokens.length != 0 && tokens[0] == "^") {

		// Store the first token
		var tok = tokens.shift();

		// Parse sub-expression
		var sexpr = parseEXPR3(tokens);

		// Check for error
		if(sexpr == null)
			return null;		

		result = new Node(tok, result, sexpr);
		
	}
	
	return result;

}

function parseEXPR4(tokens) {

	// expr4 -> [-] expr5
	var negate = false;
	if(tokens.length != 0 && tokens[0] == "-") {
		negate = true;
		tokens.shift();
	}

	// Parse sub-expression
	var result = parseEXPR5(tokens);

	if(negate) {
		modifier = new Node("-1", null, null);
		result = new Node("*", result, modifier);
	}
	
	return result;

}

function parseEXPR5(tokens) {

	if(tokens.length == 0)
		return null;

	// expr5 -> ( expr1 )
	if(tokens[0] == "(") {
		tokens.shift();
		var expr = parseEXPR1(tokens);
		if(tokens.length == 0 || tokens[0] != ")")
			return null;
		tokens.shift();
		return expr;
	}
	
	// expr5 -> number
	if(!isNaN(tokens[0])) {
		return new Node(tokens.shift(), null, null);
	}
	
	// expr5 -> variable
	if(tokens[0].toLowerCase() == "z") {
		tokens.shift();
		return new Node("z", null, null);
	}
/*
	// expr5 -> variable
	if(/[1-9]+z/i.test(tokens[0])) {
		var num = tokens.shift();
		num = num.substring(0, num.length - 1);
		var left = new Node("z", null, null);
		var right = new Node(num, null, null);
		return new Node("*", left, right);
	}
*/
	// ^^^^^^^^^^ FIX THIS! ERROR WITH SOMETHING LIKE 5Z^2
	
	// expr5 -> number
	if(tokens[0].toLowerCase() == "i") {
		tokens.shift();
		return new Node("i", null, null);
	}
	
	// expr5 -> number
	if(/[0-9]*[.[0-9]+]?i/i.test(tokens[0])) {
		var num = tokens.shift();
		num = num.substring(0, num.length - 1);
		var left = new Node("i", null, null);
		var right = new Node(num, null, null);
		return new Node("*", left, right);
	}
	
	return null;

}
