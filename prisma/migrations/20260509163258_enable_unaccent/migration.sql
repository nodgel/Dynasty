-- Enable the unaccent contrib extension so search queries can match
-- "Süleyman" when the user types "suleyman" (and similar diacritic-stripping
-- behavior for any other Latin-derived names with accents).
--
-- "Trusted" extension since Postgres 13: any role with CREATE on the database
-- can install it. On production we run `CREATE EXTENSION unaccent` once as
-- the postgres superuser before applying migrations, so this is a no-op there.
CREATE EXTENSION IF NOT EXISTS unaccent;
