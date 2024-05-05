CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE "user" (
    id BIGSERIAL PRIMARY KEY,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    login VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash_and_salt VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    profile_image TEXT DEFAULT NULL,
    subscribed BIGINT NOT NULL DEFAULT 0,
    subscribers BIGINT NOT NULL DEFAULT 0,
    amount_of_complaints_on_profile INT CHECK (amount_of_complaints_on_profile >= 0) DEFAULT 0,
    amount_of_complaints_on_comment INT CHECK (amount_of_complaints_on_comment >= 0) DEFAULT 0,
    amount_of_complaints_on_image INT CHECK (amount_of_complaints_on_image >= 0) DEFAULT 0
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
    CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES "user"(id)
);


CREATE TABLE "like" (
    id_user BIGINT NOT NULL,
    id_image BIGINT NOT NULL,
    CONSTRAINT fk_id_author
        FOREIGN KEY(id_user) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_id_image
        FOREIGN KEY(id_image) REFERENCES image(id) ON DELETE CASCADE,
    CONSTRAINT pk_id_author_id_image_like PRIMARY KEY (id_user, id_image)
);


CREATE TABLE saved (
    id_user BIGINT NOT NULL,
    id_image BIGINT NOT NULL,
    CONSTRAINT fk_id_author
        FOREIGN KEY(id_user) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_id_image
        FOREIGN KEY(id_image) REFERENCES image(id) ON DELETE CASCADE,
    CONSTRAINT pk_id_author_id_image_saved PRIMARY KEY (id_user, id_image)
);

-- TODO: As future update, could be added prevent system for complaint bombing
--       (add account make complaint delete account, and do it again)

CREATE TABLE complaint_image (
    id_user BIGINT DEFAULT NULL,
    id_image BIGINT NOT NULL,
    CONSTRAINT fk_id_user
        FOREIGN KEY(id_user) REFERENCES "user"(id) ON DELETE SET NULL,
    CONSTRAINT fk_id_image
        FOREIGN KEY(id_image) REFERENCES image(id) ON DELETE CASCADE,
    CONSTRAINT pk_author_user_object PRIMARY KEY (id_user, id_image)
);

CREATE TABLE complaint_profile (
    id_user BIGINT DEFAULT NULL,
    id_profile_owner BIGINT NOT NULL,
    CONSTRAINT fk_id_profile_owner
        FOREIGN KEY(id_profile_owner) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_id_user
        FOREIGN KEY(id_user) REFERENCES "user"(id) ON DELETE SET NULL,
    CONSTRAINT pk_profile_user PRIMARY KEY (id_user, id_profile_owner)
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

CREATE TABLE complaint_comment (
    id_user BIGINT DEFAULT NULL,
    id_comment BIGINT NOT NULL,
    CONSTRAINT fk_id_user
        FOREIGN KEY(id_user) REFERENCES "user"(id) ON DELETE SET NULL,
    CONSTRAINT fk_id_comment
        FOREIGN KEY(id_comment) REFERENCES comment(id) ON DELETE CASCADE,
    CONSTRAINT pk_author_user_comment PRIMARY KEY (id_user, id_comment)
);


CREATE TABLE image_tag (
    image_id BIGINT,
    tag_id INT NOT NULL,
    CONSTRAINT fk_image_tag_to_image FOREIGN KEY (image_id) REFERENCES image(id),
    CONSTRAINT fk_image_tage_to_tag FOREIGN KEY (tag_id) REFERENCES tag(id),
    CONSTRAINT pk_image_tag PRIMARY KEY (image_id, tag_id)
);

CREATE TABLE subscribe (
    id_subscriber BIGINT NOT NULL,
    id_subscribed_on BIGINT NOT NULL,
    CONSTRAINT fk_subscriber_to_user FOREIGN KEY (id_subscriber) REFERENCES "user"(id) ON DELETE CASCADE ,
    CONSTRAINT fk_subscribed_to_user FOREIGN KEY (id_subscribed_on) REFERENCES "user"(id) ON DELETE CASCADE ,
    CONSTRAINT pk_subscriber PRIMARY KEY (id_subscriber, id_subscribed_on)
);