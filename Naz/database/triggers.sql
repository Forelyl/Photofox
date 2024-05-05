CREATE OR REPLACE FUNCTION increase_like_count()
       RETURNS TRIGGER
       LANGUAGE PLPGSQL
       AS
$$
BEGIN
--     SELECT like_counter INTO like_count FROM image WHERE NEW.image_id = image.id;
    UPDATE image SET like_counter = like_counter+1 WHERE NEW.id_image = image.id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER like_counter
    AFTER INSERT
    ON "like"
    FOR EACH ROW
    EXECUTE PROCEDURE increase_like_count();
