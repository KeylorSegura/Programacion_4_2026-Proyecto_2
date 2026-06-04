-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema proyecto2_programacion4
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `proyecto2_programacion4` ;

-- -----------------------------------------------------
-- Schema proyecto2_programacion4
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `proyecto2_programacion4` DEFAULT CHARACTER SET utf8 ;
USE `proyecto2_programacion4` ;

-- -----------------------------------------------------
-- Table `proyecto2_programacion4`.`Usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto2_programacion4`.`Usuario` ;

CREATE TABLE IF NOT EXISTS `proyecto2_programacion4`.`Usuario` (
    `id` VARCHAR(45) NOT NULL,
    `clave` VARCHAR(255) NULL,
    `tipo` VARCHAR(45) NULL,
    PRIMARY KEY (`id`))
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `proyecto2_programacion4`.`Empresa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto2_programacion4`.`Empresa` ;

CREATE TABLE IF NOT EXISTS `proyecto2_programacion4`.`Empresa` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombreUsuario` VARCHAR(45) NOT NULL,
    `nombre` VARCHAR(45) NULL,
    `localizacion` VARCHAR(45) NULL,
    `correoElectronico` VARCHAR(45) NULL,
    `telefono` VARCHAR(45) NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` TINYINT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `fk_Empresa_usuario1_idx` (`nombreUsuario` ASC) VISIBLE,
    CONSTRAINT `fk_Empresa_usuario1`
    FOREIGN KEY (`nombreUsuario`)
    REFERENCES `proyecto2_programacion4`.`Usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `proyecto2_programacion4`.`Puesto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto2_programacion4`.`Puesto` ;

CREATE TABLE IF NOT EXISTS `proyecto2_programacion4`.`Puesto` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `empresa` INT NOT NULL,
    `descripcion` VARCHAR(45) NULL,
    `salario` FLOAT NULL,
    `activo` TINYINT NULL,
    `tipoPublicacion` VARCHAR(45) NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_Puesto_Empresa_idx` (`empresa` ASC) VISIBLE,
    CONSTRAINT `fk_Puesto_Empresa`
    FOREIGN KEY (`empresa`)
    REFERENCES `proyecto2_programacion4`.`Empresa` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `proyecto2_programacion4`.`Oferente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto2_programacion4`.`Oferente` ;

CREATE TABLE IF NOT EXISTS `proyecto2_programacion4`.`Oferente` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombreUsuario` VARCHAR(45) NOT NULL,
    `nombre` VARCHAR(45) NULL,
    `primerApellido` VARCHAR(45) NULL,
    `nacionalidad` VARCHAR(45) NULL,
    `telefono` VARCHAR(45) NULL,
    `correoElectronico` VARCHAR(45) NULL,
    `lugarResidencia` VARCHAR(45) NULL,
    `estado` TINYINT NULL,
    `curriculum` LONGBLOB NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_Oferente_usuario1_idx` (`nombreUsuario` ASC) VISIBLE,
    CONSTRAINT `fk_Oferente_usuario1`
    FOREIGN KEY (`nombreUsuario`)
    REFERENCES `proyecto2_programacion4`.`Usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `proyecto2_programacion4`.`Caracteristica`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto2_programacion4`.`Caracteristica` ;

CREATE TABLE IF NOT EXISTS `proyecto2_programacion4`.`Caracteristica` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `padre` INT NULL,
    `nombre` VARCHAR(45) NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_Caracteristica_Caracteristica1_idx` (`padre` ASC) VISIBLE,
    CONSTRAINT `fk_Caracteristica_Caracteristica1`
    FOREIGN KEY (`padre`)
    REFERENCES `proyecto2_programacion4`.`Caracteristica` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `proyecto2_programacion4`.`PuestoCaracteristica`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto2_programacion4`.`PuestoCaracteristica` ;

CREATE TABLE IF NOT EXISTS `proyecto2_programacion4`.`PuestoCaracteristica` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `puesto` INT NOT NULL,
    `caracteristica` INT NOT NULL,
    `nivel` INT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_puestoCaracteristica_Puesto1_idx` (`puesto` ASC) VISIBLE,
    INDEX `fk_puestoCaracteristica_Caracteristica1_idx` (`caracteristica` ASC) VISIBLE,
    CONSTRAINT `fk_puestoCaracteristica_Puesto1`
    FOREIGN KEY (`puesto`)
    REFERENCES `proyecto2_programacion4`.`Puesto` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_puestoCaracteristica_Caracteristica1`
    FOREIGN KEY (`caracteristica`)
    REFERENCES `proyecto2_programacion4`.`Caracteristica` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `proyecto2_programacion4`.`OferenteCaracteristica`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `proyecto2_programacion4`.`OferenteCaracteristica` ;

CREATE TABLE IF NOT EXISTS `proyecto2_programacion4`.`OferenteCaracteristica` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nivel` INT NULL,
    `oferente` INT NOT NULL,
    `caracteristica` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_OferenteCaracteristica_Oferente1_idx` (`oferente` ASC) VISIBLE,
    INDEX `fk_OferenteCaracteristica_Caracteristica1_idx` (`caracteristica` ASC) VISIBLE,
    CONSTRAINT `fk_OferenteCaracteristica_Oferente1`
    FOREIGN KEY (`oferente`)
    REFERENCES `proyecto2_programacion4`.`Oferente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT `fk_OferenteCaracteristica_Caracteristica1`
    FOREIGN KEY (`caracteristica`)
    REFERENCES `proyecto2_programacion4`.`Caracteristica` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
    ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

USE `proyecto2_programacion4`;

-- Características por defecto
INSERT INTO `Caracteristica` (`id`, `padre`, `nombre`) VALUES
-- Raíces
(1,  NULL, 'Programación'),
(2,  NULL, 'Bases de Datos'),
(3,  NULL, 'Idiomas'),
(4,  NULL, 'Frameworks y Tecnologías'),
(5,  NULL, 'Habilidades Blandas'),
(6,  NULL, 'Infraestructura y DevOps'),

-- Programación
(7,  1, 'Java'),
(8,  1, 'Python'),
(9,  1, 'JavaScript'),
(10, 1, 'C++'),
(11, 1, 'C#'),
(12, 1, 'PHP'),
(13, 1, 'Go'),

-- Bases de Datos
(14, 2, 'MySQL'),
(15, 2, 'PostgreSQL'),
(16, 2, 'MongoDB'),
(17, 2, 'Oracle'),
(18, 2, 'SQL Server'),
(19, 2, 'Redis'),

-- Idiomas
(20, 3, 'Español'),
(21, 3, 'Inglés'),
(22, 3, 'Francés'),
(23, 3, 'Portugués'),
(24, 3, 'Alemán'),

-- Frameworks y Tecnologías
(25, 4, 'React'),
(26, 4, 'Angular'),
(27, 4, 'Vue.js'),
(28, 4, 'Spring Boot'),
(29, 4, 'Django'),
(30, 4, 'Node.js'),
(31, 4, 'Laravel'),
(32, 4, '.NET'),

-- Habilidades Blandas
(33, 5, 'Trabajo en equipo'),
(34, 5, 'Liderazgo'),
(35, 5, 'Comunicación'),
(36, 5, 'Resolución de problemas'),
(37, 5, 'Gestión del tiempo'),

-- Infraestructura y DevOps
(38, 6, 'Docker'),
(39, 6, 'Kubernetes'),
(40, 6, 'AWS'),
(41, 6, 'Azure'),
(42, 6, 'Google Cloud'),
(43, 6, 'Linux'),
(44, 6, 'Git');

-- Administradores con clave 1:
INSERT INTO `Usuario` (`id`, `clave`, `tipo`) VALUES
('1',     '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Administrador'),
('admin', '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Administrador'),
('root',  '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Administrador');

-- Oferentes por defecto (clave: 1)
-- sofia_lang y carlos_poly: especialistas en idiomas
-- ana_dev y miguel_code: especialistas en programación
-- keylor: todas las habilidades al nivel máximo (5)
INSERT IGNORE INTO `Usuario` (`id`, `clave`, `tipo`) VALUES
('sofia_lang',  '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Oferente'),
('carlos_poly', '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Oferente'),
('ana_dev',     '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Oferente'),
('miguel_code', '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Oferente'),
('keylor',      '$2a$10$Y9JcR78QYnYljw71lYH/o.cI8xxHfw1.DS6WfixvroX5FjhYxhiEa', 'Oferente');

-- Sin IDs explícitos: AUTO_INCREMENT asigna los IDs correctamente
INSERT INTO `Oferente` (`nombreUsuario`, `nombre`, `primerApellido`, `nacionalidad`, `telefono`, `correoElectronico`, `lugarResidencia`, `estado`, `curriculum`) VALUES
('sofia_lang',  'Sofía',  'Vargas',  'Costarricense', '60001111', 'sofia.vargas@email.com',   'San José',    1, NULL),
('carlos_poly', 'Carlos', 'Méndez',  'Mexicano',      '60002222', 'carlos.mendez@email.com',  'Guadalajara', 1, NULL),
('ana_dev',     'Ana',    'Rojas',   'Costarricense', '60003333', 'ana.rojas@email.com',      'Heredia',     1, NULL),
('miguel_code', 'Miguel', 'Torres',  'Colombiano',    '60004444', 'miguel.torres@email.com',  'Bogotá',      1, NULL),
('keylor',      'Keylor', 'Segura',  'Costarricense', '60005555', 'keylor.segura@email.com',  'San José',    1, NULL);

-- Capturar IDs generados por AUTO_INCREMENT para usar en OferenteCaracteristica
SET @sofia_id   = (SELECT id FROM `Oferente` WHERE `nombreUsuario` = 'sofia_lang'   LIMIT 1);
SET @carlos_id  = (SELECT id FROM `Oferente` WHERE `nombreUsuario` = 'carlos_poly'  LIMIT 1);
SET @ana_id     = (SELECT id FROM `Oferente` WHERE `nombreUsuario` = 'ana_dev'      LIMIT 1);
SET @miguel_id  = (SELECT id FROM `Oferente` WHERE `nombreUsuario` = 'miguel_code'  LIMIT 1);
SET @keylor_id  = (SELECT id FROM `Oferente` WHERE `nombreUsuario` = 'keylor'       LIMIT 1);

-- OferenteCaracteristica: habilidades por oferente (sin IDs explícitos)
-- Sofía: especialista en idiomas
INSERT INTO `OferenteCaracteristica` (`nivel`, `oferente`, `caracteristica`) VALUES
(5, @sofia_id, 20), -- Español
(5, @sofia_id, 21), -- Inglés
(4, @sofia_id, 22), -- Francés
(4, @sofia_id, 23), -- Portugués
(3, @sofia_id, 24), -- Alemán
(5, @sofia_id, 35), -- Comunicación
(4, @sofia_id, 33), -- Trabajo en equipo
(3, @sofia_id, 37), -- Gestión del tiempo
(2, @sofia_id, 9),  -- JavaScript
(1, @sofia_id, 8);  -- Python

-- Carlos: especialista en idiomas (multilingüe)
INSERT INTO `OferenteCaracteristica` (`nivel`, `oferente`, `caracteristica`) VALUES
(5, @carlos_id, 20), -- Español
(4, @carlos_id, 21), -- Inglés
(5, @carlos_id, 22), -- Francés
(5, @carlos_id, 23), -- Portugués
(4, @carlos_id, 24), -- Alemán
(4, @carlos_id, 35), -- Comunicación
(3, @carlos_id, 34), -- Liderazgo
(1, @carlos_id, 7);  -- Java

-- Ana: especialista en programación (backend/fullstack)
INSERT INTO `OferenteCaracteristica` (`nivel`, `oferente`, `caracteristica`) VALUES
(5, @ana_id, 7),  -- Java
(5, @ana_id, 8),  -- Python
(4, @ana_id, 9),  -- JavaScript
(4, @ana_id, 11), -- C#
(3, @ana_id, 13), -- Go
(2, @ana_id, 12), -- PHP
(5, @ana_id, 14), -- MySQL
(4, @ana_id, 15), -- PostgreSQL
(3, @ana_id, 16), -- MongoDB
(4, @ana_id, 25), -- React
(5, @ana_id, 28), -- Spring Boot
(4, @ana_id, 29), -- Django
(3, @ana_id, 30), -- Node.js
(4, @ana_id, 38), -- Docker
(5, @ana_id, 44), -- Git
(3, @ana_id, 43), -- Linux
(3, @ana_id, 21), -- Inglés
(5, @ana_id, 20), -- Español
(4, @ana_id, 33), -- Trabajo en equipo
(4, @ana_id, 36); -- Resolución de problemas

-- Miguel: especialista en programación (DevOps/backend)
INSERT INTO `OferenteCaracteristica` (`nivel`, `oferente`, `caracteristica`) VALUES
(4, @miguel_id, 7),  -- Java
(5, @miguel_id, 8),  -- Python
(5, @miguel_id, 9),  -- JavaScript
(4, @miguel_id, 10), -- C++
(3, @miguel_id, 12), -- PHP
(4, @miguel_id, 14), -- MySQL
(5, @miguel_id, 16), -- MongoDB
(4, @miguel_id, 19), -- Redis
(3, @miguel_id, 15), -- PostgreSQL
(5, @miguel_id, 30), -- Node.js
(4, @miguel_id, 26), -- Angular
(3, @miguel_id, 27), -- Vue.js
(3, @miguel_id, 25), -- React
(5, @miguel_id, 38), -- Docker
(4, @miguel_id, 39), -- Kubernetes
(4, @miguel_id, 40), -- AWS
(5, @miguel_id, 44), -- Git
(4, @miguel_id, 43), -- Linux
(3, @miguel_id, 21), -- Inglés
(5, @miguel_id, 20), -- Español
(4, @miguel_id, 36), -- Resolución de problemas
(3, @miguel_id, 33); -- Trabajo en equipo

-- Keylor: todas las habilidades al nivel máximo (5) — incluye categorías padre e hijas
INSERT INTO `OferenteCaracteristica` (`nivel`, `oferente`, `caracteristica`) VALUES
(5, @keylor_id, 1),  -- Programación (padre)
(5, @keylor_id, 2),  -- Bases de Datos (padre)
(5, @keylor_id, 3),  -- Idiomas (padre)
(5, @keylor_id, 4),  -- Frameworks y Tecnologías (padre)
(5, @keylor_id, 5),  -- Habilidades Blandas (padre)
(5, @keylor_id, 6),  -- Infraestructura y DevOps (padre)
(5, @keylor_id, 7),  -- Java
(5, @keylor_id, 8),  -- Python
(5, @keylor_id, 9),  -- JavaScript
(5, @keylor_id, 10), -- C++
(5, @keylor_id, 11), -- C#
(5, @keylor_id, 12), -- PHP
(5, @keylor_id, 13), -- Go
(5, @keylor_id, 14), -- MySQL
(5, @keylor_id, 15), -- PostgreSQL
(5, @keylor_id, 16), -- MongoDB
(5, @keylor_id, 17), -- Oracle
(5, @keylor_id, 18), -- SQL Server
(5, @keylor_id, 19), -- Redis
(5, @keylor_id, 20), -- Español
(5, @keylor_id, 21), -- Inglés
(5, @keylor_id, 22), -- Francés
(5, @keylor_id, 23), -- Portugués
(5, @keylor_id, 24), -- Alemán
(5, @keylor_id, 25), -- React
(5, @keylor_id, 26), -- Angular
(5, @keylor_id, 27), -- Vue.js
(5, @keylor_id, 28), -- Spring Boot
(5, @keylor_id, 29), -- Django
(5, @keylor_id, 30), -- Node.js
(5, @keylor_id, 31), -- Laravel
(5, @keylor_id, 32), -- .NET
(5, @keylor_id, 33), -- Trabajo en equipo
(5, @keylor_id, 34), -- Liderazgo
(5, @keylor_id, 35), -- Comunicación
(5, @keylor_id, 36), -- Resolución de problemas
(5, @keylor_id, 37), -- Gestión del tiempo
(5, @keylor_id, 38), -- Docker
(5, @keylor_id, 39), -- Kubernetes
(5, @keylor_id, 40), -- AWS
(5, @keylor_id, 41), -- Azure
(5, @keylor_id, 42), -- Google Cloud
(5, @keylor_id, 43), -- Linux
(5, @keylor_id, 44); -- Git