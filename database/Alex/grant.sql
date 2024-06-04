GRANT SELECT, UPDATE, INSERT, DELETE ON "user"              TO fox;
GRANT SELECT, UPDATE, INSERT, DELETE ON "like"              TO fox;
GRANT SELECT, UPDATE, INSERT, DELETE ON saved               TO fox;
GRANT SELECT, UPDATE, INSERT, DELETE ON complaint_image     TO fox;
GRANT SELECT, UPDATE, INSERT, DELETE ON complaint_profile   TO fox;
GRANT SELECT, UPDATE, INSERT, DELETE ON complaint_comment   TO fox;

GRANT SELECT, USAGE ON comment_id_seq   TO fox;
GRANT SELECT, USAGE ON image_id_seq     TO fox;
GRANT SELECT, USAGE ON tag_id_seq       TO fox;
GRANT SELECT, USAGE ON user_id_seq      TO fox;