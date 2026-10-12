INSERT INTO employees (
    username,
    password,
    role,
    language
)
SELECT
    'test',
    '$2b$10$dTKlVXk6mjFDOnOpa/sVzeigCvpFSFL5z2sNc9GP1/ROJXLigck8a',
    'uploader',
    'ar'
WHERE NOT EXISTS (
    SELECT 1
    FROM employees
    WHERE username = 'test'
);