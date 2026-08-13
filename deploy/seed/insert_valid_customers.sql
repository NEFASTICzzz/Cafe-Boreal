TRUNCATE TABLE customers RESTART IDENTITY CASCADE;
INSERT INTO customers (name, email, identity_number_encrypted) VALUES
('María Rodríguez Fonseca', 'mrodriguez@boreal.cr', '24a054f81534190537d54ba280c86b1d:54a569fbd60af551427ff27f137c2147'),
('Carlos Solano Vargas', 'csolano@boreal.cr', '525c592e32a11b4d4d59ab389a1b416d:88191814e2b925f68b9bc89d19f4faca'),
('Ana Lucía Chaves', 'achaves@gmail.com', '4143def66a2b8dbc614eafeb98d13d22:112845f2ec0ccbf368db952ec1c0553d'),
('Roberto Quesada Mora', 'rquesada@hotmail.com', '7ab7830fb9765f0eb54a7f1f1d82dafd:9d7e8af2a72c1b175312a7cfacc0f996'),
('Sofía Valverde Blanco', 'svalverde@outlook.com', '23171763872b2fba720d2e9be125e565:5cc507fd495c294b3a9826764c5027c4'),
('Esteban Zúñiga Castillo', 'ezuniga@boreal.cr', '27bcb0eda1ebe65a3af75c66fb637bf4:b57d8ad9faaadfd0361c97ac83c52ec2'),
('Laura Araya Gamboa', 'laraya@empresa.cr', 'd2a7195b7888231c545c433c97eed38d:5abba4792d647c5b0137c7211954e546'),
('Gabriel Villalobos Soto', 'gvillalobos@tech.cr', 'c51a392fa58d7d942354ad0170ceaf13:086a881ded57d80c2e45c7f9be06ea46'),
('Daniela Monge Rojas', 'dmonge@gmail.com', '5c0b49770599c15d621dc4ff22446f67:4996211f36cf10143d3843635c5f0a6e'),
('Kevin Brenes Hernández', 'kbrenes@boreal.cr', '2496c2916ecedf5f309963942a3f48fa:8eb5a8e8ff87e8e253cb006c87131c7c'),
('Valeria Hidalgo Campos', 'vhidalgo@coffeelovers.cr', '4e3814682b0c877ea8fe8d4915b792f1:e46d5c68f7aea4231d0948806b5ad562'),
('Alejandro Fallas Navarro', 'afallas@utn.ac.cr', '055b14c93aee88366c7772708e0b8cca:82c31368d1ff60dceaae2f8b039ec053');

