CREATE OR REPLACE FUNCTION get_next_id_of_image()
       RETURNS BIGINT
       LANGUAGE PLPGSQL
       AS
$get_next_id$
DECLARE
    next_id BIGINT := 0;
    junk    BIGINT := 0;
BEGIN
    SELECT nextval('image_id_seq') INTO next_id;
    ALTER SEQUENCE image_id_seq INCREMENT -1;

    SELECT nextval('image_id_seq') INTO junk;
    ALTER SEQUENCE image_id_seq INCREMENT 1;

    RETURN next_id;
END;
$get_next_id$;