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
    privateKey VARCHAR(1024),
    birthday INT,
    gender INT,
    location VARCHAR(128),
    signature VARCHAR(256),
    avatar VARCHAR(256),
    follow VARCHAR(1024),
    beFollowed VARCHAR(1024)
);

CREATE TABLE anthology(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid INT,
    anthologyName VARCHAR(128)  
);

CREATE TABLE article(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid INT,
    anthologyId INT,
    articleName VARCHAR(128),
    articleText TEXT,
    word INT,
    heart INT,
    releaseName VARCHAR(128),
    releasePic VARCHAR(256),
    releaseOutline VARCHAR(256),
    isRelease INT
);

CREATE TABLE comment(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid INT,
    articleId INT,
    parentCommitId INT
);

INSERT INTO user VALUES (
    null, '飞翔的鱼','123456','17621305731','ruijiesze@foxmail.com',
    0, null,null, null,1,'江苏苏州',
    '山有木兮木有枝，心悦君兮君不知。','http://b-ssl.duitang.com/uploads/item/201511/21/20151121171107_zMZcy.jpeg','[]'
);
INSERT INTO user VALUES (
    null, '蓝色气球','123456','17621305732','12312324@foxmail.com',
    0, null,null, null,1,'上海',
    '人生若只如初见，何事秋风悲画扇。','http://b-ssl.duitang.com/uploads/item/201706/03/20170603233333_tkhvr.thumb.700_0.jpeg','[]'
);
INSERT INTO user VALUES (
    null, '寂寞岛','123456','17621305733','543234421@foxmail.com',
    0, null,null, null,1,'江苏盐城',
    '十年生死两茫茫，不思量，自难忘。','http://img5.imgtn.bdimg.com/it/u=370233348,678876209&fm=26&gp=0.jpg','[]'
);
INSERT INTO user VALUES (
    null, '卖钉子的小男孩','123456','17621305734','sadw23@foxmail.com',
    0, null,null, null,1,'江苏南京',
    '曾经沧海难为水，除却巫山不是云。','http://image.biaobaiju.com/uploads/20190807/13/1565155412-eZhVxlDITj.png','[]'
);
INSERT INTO user VALUES (
    null, '此间少年','123456','17621305735','gfger4@foxmail.com',
    0, null,null, null,1,'浙江杭州',
    '玲珑骰子安红豆，入骨相思知不知。','http://img.ewebweb.com/uploads/20191010/15/1570691805-tyDipClsMV.jpg','[]'
);
INSERT INTO user VALUES (
    null, 'BABY follow me!!','123456','17621305736','jght5@foxmail.com',
    0, null,null, null,1,'美国',
    '只愿君心似我心，定不负相思意。','http://img.tukexw.com/img/d691665d5282517e.jpg','[]'
);
INSERT INTO user VALUES (
    null, '旧院女人','123456','17621305737','qwe32@foxmail.com',
    0, null,null, null,1,'云南洱海',
    '山无陵，江水为竭。冬雷震震，夏雨雪。天地合，乃敢与君绝。','http://b-ssl.duitang.com/uploads/item/201511/21/20151121171107_zMZcy.jpeg','[]'
);
INSERT INTO user VALUES (
    null, '夏鲤','123456','17621305788','dfdfgr@foxmail.com',
    0, null,null, null,1,'日月湖',
    '雨打梨花深闭门，忘了青春，误了青春。','http://b-ssl.duitang.com/uploads/item/201511/21/20151121171107_zMZcy.jpeg','[]'
);
INSERT INTO user VALUES (
    null, '想失忆！','123456','17621305739','ert345@foxmail.com',
    0, null,null, null,1,'云南昆明',
    '寂寞空庭春欲晚，梨花满地不开门。','http://img1.imgtn.bdimg.com/it/u=993042416,3363049694&fm=214&gp=0.jpg','[]'
);
INSERT INTO user VALUES (
    null, '转身&未来','123456','17621305711','ert434@foxmail.com',
    0, null,null, null,1,'北京',
    '晓看天色暮看云，行也思君，坐也思君。','http://b-ssl.duitang.com/uploads/item/201605/18/20160518191429_Ujdra.thumb.700_0.jpeg','[]'
);