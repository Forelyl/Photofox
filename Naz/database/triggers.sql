CREATE OR REPLACE FUNCTION increase_like_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$$
BEGIN
    UPDATE image SET like_counter = like_counter+1 WHERE NEW.id_image = image.id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER like_counter
    AFTER INSERT
    ON "like"
    FOR EACH ROW
    EXECUTE PROCEDURE increase_like_count();


CREATE OR REPLACE FUNCTION increase_comment_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$$
BEGIN
    UPDATE image SET comment_counter = comment_counter+1 WHERE NEW.image_id = image.id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER comment_counter
    AFTER INSERT
    ON comment
    FOR EACH ROW
    EXECUTE PROCEDURE increase_comment_count();


CREATE OR REPLACE FUNCTION increase_complaint_count_image()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$$
DECLARE
    user_id BIGINT;
BEGIN
    UPDATE image SET report_counter = report_counter+1 WHERE NEW.id_image = image.id;

    SELECT image.author_id INTO user_id FROM image WHERE image.id = NEW.id_image;
    UPDATE "user" SET amount_of_complaints_on_image = amount_of_complaints_on_image+1 WHERE user_id = "user".id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER complaint_counter_image
    AFTER INSERT
    ON complaint_image
    FOR EACH ROW
    EXECUTE PROCEDURE increase_complaint_count_image();


CREATE OR REPLACE FUNCTION increase_complaint_count_comment()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$$
DECLARE
    user_id BIGINT;
BEGIN
    UPDATE comment SET report_counter = report_counter+1 WHERE NEW.id_comment = comment.id;

    SELECT comment.user_id INTO user_id FROM comment WHERE comment.id = NEW.id_comment;
    UPDATE "user" SET amount_of_complaints_on_comment = amount_of_complaints_on_comment+1 WHERE user_id = "user".id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER complaint_counter_comment
    AFTER INSERT
    ON complaint_comment
    FOR EACH ROW
    EXECUTE PROCEDURE increase_complaint_count_comment();


CREATE OR REPLACE FUNCTION increase_complaint_count_profile()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$$
BEGIN
    UPDATE "user" SET amount_of_complaints_on_profile = amount_of_complaints_on_profile+1 WHERE NEW.id_profile_owner = "user".id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER complaint_counter_profile
    AFTER INSERT
    ON complaint_profile
    FOR EACH ROW
    EXECUTE PROCEDURE increase_complaint_count_profile();


CREATE OR REPLACE FUNCTION increase_subscribers_count()
        RETURNS TRIGGER
        LANGUAGE PLPGSQL
        AS
$$
BEGIN
    UPDATE "user" SET subscribers = subscribers+1 WHERE NEW.id_subscribed_on = "user".id;
    UPDATE "user" SET subscribed = subscribed+1 WHERE NEW.id_subscriber = "user".id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER subscribe_counter
    AFTER INSERT
    ON subscribe
    FOR EACH ROW
    EXECUTE PROCEDURE increase_subscribers_count();