
CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE image (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    image TEXT NOT NULL,
    title VARCHAR(100),
    description TEXT DEFAULT NULL,
    download_permission BOOLEAN DEFAULT FALSE,
    like_counter INT DEFAULT 0,
    report_counter INT DEFAULT 0,
    comment_counter INT DEFAULT 0,
    adding_date DATE NOT NULL,
    width INT DEFAULT 0 CHECK (width > 0),
    height INT DEFAULT 0 CHECK (width > 0),
    CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE image_tag (
    image_id BIGINT,
    tag_id INT NOT NULL,
    CONSTRAINT fk_image_tag_to_image FOREIGN KEY (image_id) REFERENCES image(id),
    CONSTRAINT fk_image_tage_to_tag FOREIGN KEY (tag_id) REFERENCES tag(id),
    CONSTRAINT pk_image_tag PRIMARY KEY (image_id, tag_id)
);

CREATE TABLE comment (
    id BIGSERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    image_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    report_counter INT DEFAULT 0,
    adding_date DATE NOT NULL,
    CONSTRAINT fk_comment_to_user FOREIGN KEY (user_id) REFERENCES "user"(id),
    CONSTRAINT fk_comment_to_image FOREIGN KEY (image_id) REFERENCES image(id)
);

CREATE TABLE subscribe (
    id_subscriber BIGINT NOT NULL,
    id_subscribed_on BIGINT NOT NULL,
    CONSTRAINT fk_subscriber_to_user FOREIGN KEY (id_subscriber) REFERENCES "user"(id),
    CONSTRAINT fk_subscriber_to_user FOREIGN KEY (id_subscribed_on) REFERENCES "user"(id),
    CONSTRAINT pk_subscriber PRIMARY KEY (id_subscriber, id_subscribed_on),
    CONSTRAINT not_self_subscribing CHECK (id_subscriber != subscribe.id_subscribed_on)
);
