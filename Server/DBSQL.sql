CREATE DATABASE dbname;

USE dbname;

CREATE TABLE IF NOT EXISTS users (
	userID int NOT NULL AUTO_INCREMENT,
	username varchar(64) NOT NULL,
	email varchar(255) NOT NULL,
	salt char(29) NOT NULL,
	passwordHash char(60) NOT NULL,
	homeLat DECIMAL(10, 8), 
	homeLng DECIMAL(11, 8),
	CONSTRAINT PK_user PRIMARY KEY (userID)
);

CREATE TABLE IF NOT EXISTS market_product (
	productID int NOT NULL AUTO_INCREMENT,
	product varchar(256),
	CONSTRAINT PK_user PRIMARY KEY (productID)
);

CREATE TABLE IF NOT EXISTS market_users (
	marketID int NOT NULL AUTO_INCREMENT,
	name varchar(55),
    passwordHash char(60),
    email varchar(255),
    phone varchar(255),
	contact varchar(255),
    status enum('Approved','Pending','Denied'),
    address varchar(255),
    city varchar(255),
    state varchar(255),
    zip int,
	salt char(29) NOT NULL,
	CONSTRAINT PK_mark_user PRIMARY KEY (marketID)
);

CREATE TABLE IF NOT EXISTS market_inventory (
	marketID int NOT NULL REFERENCES market_product(marketID),
	productID int NOT NULL REFERENCES market_product(productID),
	CONSTRAINT PK_market PRIMARY KEY (marketID, productID)
);

CREATE TABLE IF NOT EXISTS admins(
	adminID int NOT NULL AUTO_INCREMENT,
    username varchar(55) NOT NULL,
    email varchar(256) NOT NULL,
    passwordHash char(60) NOT NULL,
    CONSTRAINT PK_admin PRIMARY KEY (adminID)
);
