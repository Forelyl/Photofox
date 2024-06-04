INSERT INTO "user"(login, email, hash_and_salt)
    VALUES ('alpaca', 'alpaca@gmail.com', '123$123$123');

INSERT INTO "user"(login, email, hash_and_salt)
    VALUES ('cat', 'cat@gmail.com', '223$122$223');


INSERT INTO image(author_id, image, title, description, adding_date, width, height)
    VALUES (1, 'https://www.q.com/1251', 'Alpaca tree', 'Nice one tree', NOW(), 100, 100);

INSERT INTO "like"(id_user, id_image) VALUES (2, 1);