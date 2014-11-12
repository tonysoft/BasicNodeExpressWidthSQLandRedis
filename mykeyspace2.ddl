DROP KEYSPACE myK;

CREATE KEYSPACE myK WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': '1'
};

USE myK;

CREATE TABLE users (
    username text,
    fname text,
    lname text,
    timestamp timeuuid,
    birth_year int,
    email map<text, text>,
    dummy int,
    phone_numbers set<bigint>,
    sports set<text>,
    PRIMARY KEY (dummy, timestamp, username)
  );
  --WITH CLUSTERING ORDER BY (timestamp DESC);




--CREATE INDEX users_lname_idx ON users (lname);

CREATE INDEX users_fname_idx ON users (fname);

--CREATE INDEX users_timestamp_idx ON users (timestamp);

--CREATE INDEX users_dummy_idx ON users (dummy);

INSERT INTO users (username, fname, lname, birth_year, email, phone_numbers, dummy, timestamp)
VALUES ('jbellis', 'Jonathan', 'Ellis', 1976, {'work' : 'jon@iRelate.us'}, {1112223333, 2223334444}, 0, now());

--INSERT INTO users (username, fname, lname, birth_year, )
--VALUES ('tonysoft', 'Tony', 'Sukiennik', 1953);

--INSERT INTO users (username, email, phone_numbers, dummy, timestamp, fname, lname, birth_year)
--VALUES ('tonysoft', {'work': 'tony@iRelate.us', 'personal': 'tony.sukiennik@gmail.com'}, {6032244208, 6037319375}, 0, now(), 'Tony', 'Sukiennik', 1953);

INSERT INTO users (username, email, phone_numbers, dummy, timestamp, fname, lname, birth_year)
VALUES ('tonysoft', {'work': 'tony@iRelate.us', 'personal': 'tony.sukiennik@gmail.com'}, {6032244208, 6037319375}, 0, now(), 'Tony', 'Sukiennik', 1953);

--UPDATE users
--  SET phone_numbers = phone_numbers + {6034918125} WHERE username = 'tonysoft';

--UPDATE users
--  SET sports = sports + {'hockey'} WHERE username = 'tonysoft';

--UPDATE users
--  SET sports = sports + {'golf'} WHERE username = 'tonysoft';

--UPDATE users
--  SET sports = sports - {'golf'} WHERE username = 'tonysoft';

--UPDATE users
--  SET sports = sports + {'football'} WHERE username = 'tonysoft';

--DELETE sports['golf'] FROM users WHERE user_id = 'tonysoft';

--UPDATE users
-- SET sports = sports + {'baseball'} WHERE username = 'tonysoft';

--UPDATE users
--  SET email = email + {'personal': 'jbellis@gmail.com'} WHERE username = 'jbellis';

select username, dateOf(timestamp), sports, unixTimestampOf(timestamp), timestamp from users where dummy IN (0, 1) ORDER BY timestamp DESC;
