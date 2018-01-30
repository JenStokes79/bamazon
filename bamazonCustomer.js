var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon_DB"
});


connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as ID " + connection.threadId + "\n");
	displayAll();
	userPromptItem();
	//connection.end();

});

function displayAll(){
	connection. query("SELECT * FROM products",function(err, res){
		if (err) throw err;
		console.log(res);
		console.log("press any key to continue")

	});
}


function validateInput(value){
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if(integer && (sign === 1)){
		return true;
	}else {
		return 'Please enter a number.';
	}
}





function userPromptItem() {
	inquirer.prompt([
	{
		type:"input",
		message: "What product ID would you like to buy?",
		validate: validateInput,
		filter: Number,
		name: "item_id"
	},
		{
			type: "input",
			message: "How many would you like to buy?",
			validate: validateInput,
			filter: Number,
			name: "stock_qty"
		}

	]).then(function(inquirerResponse){
		var item = inquirerResponse.item_id;
		var quantity = inquirerResponse.stock_qty;

		var queryStr = 'SELECT * FROM products WHERE ?';
		connection.query(queryStr, {item_id: item}, function(err, data){
			if (err) throw err;

			if (data.length === 0){
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				//displayInventory();
			} else {
				var productData = data[0];
				// console.log('productData = ' + JSON.stringify(productData));
				// console.log('productData.stock_quantity = ' + productData.stock_qty);

				// If the quantity requested by the user is in stock
				if (quantity <= productData.stock_qty){
					console.log('Congratulations, the item you are requesting is in stock!.....Placing order');

					var updateQueryStr = 'UPDATE products SET stock_qty = ' + (productData.stock_qty - quantity) + ' WHERE item_id = ' + item;
					//console.log('updateQueryStr = ' + updateQueryStr);

					connection.query(updateQueryStr, function(err, data){
						if (err) throw err;
						console.log('Your order has been placed. Your total is $' + productData.price * quantity);
						console.log('Thank you, please come again!');
						console.log("\n--------------------\n")

						connection.end();
					})
				} else {
					console.log('Sorry, there is not a enough product in stock, your order cannot be be placed');
					console.log('Please choose another quantity');
					console.log("\n--------------------\n");
					

				}
			}
		})
	
	})
};









