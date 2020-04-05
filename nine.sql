SET NAMES utf8;
DROP DATABASE IF EXISTS nine;
CREATE DATABASE nine CHARSET=utf8;
USE nine;
CREATE TABLE user(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(16),
    password VARCHAR(128),
    phone VARCHAR(11),
    email VARCHAR(256),
    userType INT,
    publicKey VARCHAR(1024),
    privateKey VARCHAR(1024)
);

