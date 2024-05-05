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