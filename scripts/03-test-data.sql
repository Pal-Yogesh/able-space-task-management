-- Test script to validate database schema and constraints
-- Run this to ensure all tables and relationships work correctly

-- Test user creation
DO $$
DECLARE
  test_user_id INTEGER;
  test_task_id INTEGER;
BEGIN
  -- Clean up test data if exists
  DELETE FROM task_assignments WHERE task_id IN (
    SELECT id FROM tasks WHERE title LIKE 'TEST_%'
  );
  DELETE FROM tasks WHERE title LIKE 'TEST_%';
  DELETE FROM users WHERE email LIKE 'test_%@test.com';

  -- Insert test user
  INSERT INTO users (email, password_hash, name)
  VALUES ('test_user@test.com', '$2a$10$TestHashHere', 'Test User')
  RETURNING id INTO test_user_id;

  -- Insert test task
  INSERT INTO tasks (title, description, status, priority, created_by, assigned_to)
  VALUES (
    'TEST_Task_' || test_user_id,
    'This is a test task to verify database functionality',
    'pending',
    'high',
    test_user_id,
    test_user_id
  )
  RETURNING id INTO test_task_id;

  -- Test task assignment
  INSERT INTO task_assignments (task_id, user_id)
  VALUES (test_task_id, test_user_id);

  RAISE NOTICE 'Database validation successful! Test user ID: %, Test task ID: %', test_user_id, test_task_id;
END $$;

-- Verify indexes exist
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE tablename IN ('users', 'tasks', 'task_assignments')
ORDER BY tablename, indexname;
