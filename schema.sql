CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE TABLE products(
item_id INT(10) NOT NULL,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(10,4) NOT NULL,
stock_qty INT(10) NOT NULL
);

