BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined, age, pet, avatar) VALUES ('Jessie', 'jessie@gmail.com', 5, '2018-01-01', 26, 'turtle', 'https://www.at-languagesolutions.com/en/wp-content/uploads/2016/06/http-1.jpg');
INSERT INTO login (hash, email) VALUES ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'jessie@gmail.com');

COMMIT;