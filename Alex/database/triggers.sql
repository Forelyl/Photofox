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
