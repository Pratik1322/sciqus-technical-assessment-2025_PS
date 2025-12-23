-- Seed data for courses and students

-- Insert sample courses
INSERT INTO courses (course_name, course_code, course_duration) VALUES
    ('Full Stack Web Development', 'FSWD-101', 12),
    ('Data Science and Machine Learning', 'DSML-201', 16),
    ('Cloud Computing and DevOps', 'CCDO-301', 10)
ON CONFLICT (course_code) DO NOTHING;

-- Insert admin user with dummy hashed password
-- Password: 'admin123' (hashed using bcrypt - this is just a sample hash)
INSERT INTO students (name, email, password_hash, role, course_id) VALUES
    (
        'Admin User',
        'admin@example.com',
        '$2b$10$rKjJYVGXvZxJYZxMYvZxJYvZxJYvZxJYvZxJYvZxJYvZxJYvZxJYu',
        'admin',
        NULL
    )
ON CONFLICT (email) DO NOTHING;
