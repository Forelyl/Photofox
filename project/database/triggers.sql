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
BEGIN
    UPDATE image SET report_counter = report_counter+1 WHERE NEW.id_image = image.id;
    UPDATE "user" SET amount_of_complaints_on_image = amount_of_complaints_on_image+1 WHERE NEW.id_image_author = "user".id;
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
BEGIN
    UPDATE comment SET report_counter = report_counter+1 WHERE NEW.id_comment = comment.id;
    UPDATE "user" SET amount_of_complaints_on_comment = amount_of_complaints_on_comment+1 WHERE NEW.id_comment_author = "user".id;
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


CREATE OR REPLACE FUNCTION decrease_complaint_image_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$decrease_complaint$
DECLARE
    complaint_amount INT;
BEGIN
    SELECT report_counter INTO complaint_amount FROM image WHERE OLD.id_image = image.id;
    UPDATE image SET report_counter = GREATEST(complaint_amount - 1, 0) WHERE OLD.id_image = image.id;

    SELECT amount_of_complaints_on_image INTO complaint_amount FROM "user" WHERE OLD.id_image_author = "user".id;
    UPDATE "user" SET amount_of_complaints_on_image = GREATEST(complaint_amount - 1, 0)
        WHERE OLD.id_image_author = "user".id;

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
BEGIN
    SELECT report_counter INTO complaint_amount FROM comment WHERE OLD.id_comment = comment.id;
    UPDATE comment SET report_counter = GREATEST(complaint_amount - 1, 0) WHERE OLD.id_comment = comment.id;

    SELECT amount_of_complaints_on_comment INTO complaint_amount FROM "user" WHERE OLD.id_comment_author = "user".id;
    UPDATE "user" SET amount_of_complaints_on_comment = GREATEST(complaint_amount - 1, 0)
        WHERE OLD.id_comment_author = "user".id;

    RETURN NEW;
END;
$decrease_complaint$;

CREATE TRIGGER image_complaint_decrease_counter
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
