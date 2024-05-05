-----------------------------------
-- Increasing
-----------------------------------

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
-----------------------------------
-- Decreasing
-----------------------------------

CREATE OR REPLACE FUNCTION decrease_like_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$decrease_like$
DECLARE
    like_amount INT;
BEGIN
    SELECT like_counter INTO like_amount FROM image WHERE OLD.id_image = image.id;
    UPDATE image SET like_counter = GREATEST(like_amount - 1, 0) WHERE OLD.id_image = image.id;
    RETURN NEW;
END;
$decrease_like$;

CREATE TRIGGER like_decrease_counter
    AFTER DELETE
    ON "like"
    FOR EACH ROW
    EXECUTE PROCEDURE decrease_like_count();

------------

CREATE OR REPLACE FUNCTION decrease_comment_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$decrease_comment$
DECLARE
    comment_amount INT;
BEGIN
    SELECT comment_counter INTO comment_amount FROM image WHERE OLD.image_id = image.id;
    UPDATE image SET comment_counter = GREATEST(comment_amount - 1, 0) WHERE OLD.image_id = image.id;
    RETURN NEW;
END;
$decrease_comment$;

CREATE TRIGGER like_decrease_counter
    AFTER DELETE
    ON comment
    FOR EACH ROW
    EXECUTE PROCEDURE decrease_comment_count();

------------


CREATE OR REPLACE FUNCTION decrease_complaint_image_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$decrease_complaint$
DECLARE
    complaint_amount INT;
    user_id BIGINT;
BEGIN
    SELECT report_counter INTO complaint_amount FROM image WHERE OLD.id_image = image.id;
    UPDATE image SET report_counter = GREATEST(complaint_amount - 1, 0) WHERE OLD.id_image = image.id;

    SELECT image.author_id INTO user_id FROM image WHERE image.id = OLD.id_image;
    SELECT amount_of_complaints_on_image INTO complaint_amount FROM "user" WHERE user_id = "user".id;
    UPDATE "user" SET amount_of_complaints_on_image = GREATEST(complaint_amount - 1, 0)
        WHERE user_id = "user".id;

    RETURN NEW;
END;
$decrease_complaint$;

CREATE TRIGGER image_complaint_decrease_counter
    AFTER DELETE
    ON complaint_image
    FOR EACH ROW
    EXECUTE PROCEDURE decrease_complaint_image_count();

-------------

CREATE OR REPLACE FUNCTION decrease_complaint_comment_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$decrease_complaint$
DECLARE
    complaint_amount INT;
    user_id BIGINT;
BEGIN
    SELECT report_counter INTO complaint_amount FROM comment WHERE OLD.id_comment = comment.id;
    UPDATE comment SET report_counter = GREATEST(complaint_amount - 1, 0) WHERE OLD.id_comment = comment.id;

    SELECT comment.user_id INTO user_id FROM comment WHERE comment.id = OLD.id_comment;
    SELECT amount_of_complaints_on_comment INTO complaint_amount FROM "user" WHERE user_id = "user".id;
    UPDATE "user" SET amount_of_complaints_on_comment = GREATEST(complaint_amount - 1, 0)
        WHERE user_id = "user".id;

    RETURN NEW;
END;
$decrease_complaint$;

CREATE TRIGGER comment_complaint_decrease_counter
    AFTER DELETE
    ON complaint_comment
    FOR EACH ROW
    EXECUTE PROCEDURE decrease_complaint_comment_count();

-------------

CREATE OR REPLACE FUNCTION decrease_complaint_profile_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$decrease_complaint$
DECLARE
    complaint_amount INT;
BEGIN
    SELECT amount_of_complaints_on_profile INTO complaint_amount FROM "user" WHERE OLD.id_profile_owner = "user".id;
    UPDATE "user" SET amount_of_complaints_on_profile = GREATEST(complaint_amount - 1, 0) WHERE OLD.id_profile_owner = "user".id;
    RETURN NEW;
END;
$decrease_complaint$;

CREATE TRIGGER profile_complaint_decrease_counter
    AFTER DELETE
    ON complaint_profile
    FOR EACH ROW
    EXECUTE PROCEDURE decrease_complaint_profile_count();

-------------

CREATE OR REPLACE FUNCTION decrease_complaint_comment_count_comment_delete()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$decrease_complaint$
DECLARE
    complaint_amount INT;
    user_id BIGINT;
BEGIN
    user_id = OLD.user_id;
    SELECT amount_of_complaints_on_comment INTO complaint_amount FROM "user" WHERE user_id = "user".id;
    UPDATE "user" SET amount_of_complaints_on_comment = GREATEST(complaint_amount - 1, 0)
        WHERE user_id = "user".id;

    RETURN NEW;
END;
$decrease_complaint$;

CREATE TRIGGER comment_complaint_decrease_counter_comment_delete
    AFTER DELETE
    ON comment
    FOR EACH ROW
    EXECUTE PROCEDURE decrease_complaint_comment_count_comment_delete();

-------------

CREATE OR REPLACE FUNCTION decrease_subscribe()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$delete_account$
DECLARE
    subscribe_amount BIGINT;
BEGIN
    SELECT subscribers INTO subscribe_amount FROM "user" WHERE OLD.id_subscribed_on = "user".id;
    UPDATE "user" SET subscribers = GREATEST(subscribe_amount - 1, 0) WHERE OLD.id_subscribed_on = "user".id;

    SELECT subscribed INTO subscribe_amount FROM "user" WHERE OLD.id_subscriber = "user".id;
    UPDATE "user" SET subscribed = GREATEST(subscribe_amount - 1, 0) WHERE OLD.id_subscriber = "user".id;
    RETURN OLD;
END;
$delete_account$;


CREATE TRIGGER decrease_subscribe_trigger
    BEFORE DELETE
    ON "subscribe"
    FOR EACH ROW
    EXECUTE PROCEDURE decrease_subscribe();

-----------------------------------
-- Delete account
-----------------------------------


CREATE OR REPLACE FUNCTION delete_account()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$delete_account$
BEGIN
    DELETE FROM comment WHERE user_id = OLD.id;
    DELETE FROM image WHERE author_id = OLD.id;
    RETURN OLD;
END;
$delete_account$;


CREATE TRIGGER delete_account_trigger
    BEFORE DELETE
    ON "user"
    FOR EACH ROW
    EXECUTE PROCEDURE delete_account();

