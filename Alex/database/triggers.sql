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