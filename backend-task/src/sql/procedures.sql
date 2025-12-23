-- Stored Procedure: Register Student
-- This procedure validates that the course exists before inserting a student
CREATE OR REPLACE FUNCTION sp_register_student(
    p_name VARCHAR,
    p_email VARCHAR,
    p_password_hash TEXT,
    p_role user_role,
    p_course_id UUID
) RETURNS UUID AS $$
DECLARE
    v_student_id UUID;
    v_course_exists BOOLEAN;
BEGIN
    -- Validate that the course exists if course_id is provided
    IF p_course_id IS NOT NULL THEN
        SELECT EXISTS(SELECT 1 FROM courses WHERE id = p_course_id) INTO v_course_exists;
        
        IF NOT v_course_exists THEN
            RAISE EXCEPTION 'Course with id % does not exist', p_course_id;
        END IF;
    END IF;
    
    -- Insert the student
    INSERT INTO students (name, email, password_hash, role, course_id)
    VALUES (p_name, p_email, p_password_hash, p_role, p_course_id)
    RETURNING id INTO v_student_id;
    
    RETURN v_student_id;
    
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Student with email % already exists', p_email;
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Invalid course_id provided';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error registering student: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;


-- Stored Procedure: Update Student
-- This procedure updates student details and handles course reassignment
CREATE OR REPLACE FUNCTION sp_update_student(
    p_student_id UUID,
    p_name VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL,
    p_password_hash TEXT DEFAULT NULL,
    p_role user_role DEFAULT NULL,
    p_course_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_student_exists BOOLEAN;
    v_course_exists BOOLEAN;
BEGIN
    -- Check if student exists
    SELECT EXISTS(SELECT 1 FROM students WHERE id = p_student_id) INTO v_student_exists;
    
    IF NOT v_student_exists THEN
        RAISE EXCEPTION 'Student with id % does not exist', p_student_id;
    END IF;
    
    -- Validate course_id if provided (including explicit NULL to remove course)
    IF p_course_id IS NOT NULL THEN
        SELECT EXISTS(SELECT 1 FROM courses WHERE id = p_course_id) INTO v_course_exists;
        
        IF NOT v_course_exists THEN
            RAISE EXCEPTION 'Course with id % does not exist', p_course_id;
        END IF;
    END IF;
    
    -- Update student record (only update fields that are provided)
    UPDATE students
    SET
        name = COALESCE(p_name, name),
        email = COALESCE(p_email, email),
        password_hash = COALESCE(p_password_hash, password_hash),
        role = COALESCE(p_role, role),
        course_id = CASE 
            WHEN p_course_id IS NOT NULL THEN p_course_id
            ELSE course_id
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_student_id;
    
    RETURN TRUE;
    
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Email % is already taken by another student', p_email;
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Invalid course_id provided';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating student: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;


-- Stored Procedure: Delete Student
-- This procedure implements logic to either Restrict or Cascade delete
CREATE OR REPLACE FUNCTION sp_delete_student(
    p_student_id UUID,
    p_delete_mode VARCHAR DEFAULT 'restrict' -- 'restrict' or 'cascade'
) RETURNS BOOLEAN AS $$
DECLARE
    v_student_exists BOOLEAN;
    v_has_enrollments BOOLEAN := FALSE;
BEGIN
    -- Check if student exists
    SELECT EXISTS(SELECT 1 FROM students WHERE id = p_student_id) INTO v_student_exists;
    
    IF NOT v_student_exists THEN
        RAISE EXCEPTION 'Student with id % does not exist', p_student_id;
    END IF;
    
    -- Check if student is enrolled in a course
    SELECT EXISTS(SELECT 1 FROM students WHERE id = p_student_id AND course_id IS NOT NULL) 
    INTO v_has_enrollments;
    
    -- Handle delete based on mode
    IF LOWER(p_delete_mode) = 'restrict' THEN
        -- Restrict mode: fail if student is enrolled
        IF v_has_enrollments THEN
            RAISE EXCEPTION 'Cannot delete student with id % - student is enrolled in a course. Use cascade mode to force deletion.', p_student_id;
        END IF;
        
        -- Delete student if not enrolled
        DELETE FROM students WHERE id = p_student_id;
        
    ELSIF LOWER(p_delete_mode) = 'cascade' THEN
        -- Cascade mode: delete student regardless of enrollment
        DELETE FROM students WHERE id = p_student_id;
        
    ELSE
        RAISE EXCEPTION 'Invalid delete_mode: %. Use "restrict" or "cascade"', p_delete_mode;
    END IF;
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error deleting student: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
