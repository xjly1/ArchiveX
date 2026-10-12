CREATE TABLE IF NOT EXISTS employees (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (
        role IN ('uploader', 'reviewer', 'manager')
    ),
    language TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS review (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    image_data BYTEA NOT NULL,
    extracted_text TEXT NOT NULL
);