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