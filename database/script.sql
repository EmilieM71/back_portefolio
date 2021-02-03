CREATE DATABASE portefolio;
CHARACTER SET 'utf8';
USE porteFolio;

CREATE TABLE Skill (
  id SMALLINT AUTO_INCREMENT NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE project (
                id SMALLINT NOT NULL,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(1000) NOT NULL,
                id_skill SMALLINT NOT NULL,
                git VARCHAR(255) NOT NULL,
                link VARCHAR(255) NOT NULL,
                PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE project ADD CONSTRAINT skill_project_fk
FOREIGN KEY (id_skill)
REFERENCES Skill (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;