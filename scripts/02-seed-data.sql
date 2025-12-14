-- Insert demo users
INSERT INTO users (email, password_hash, name) VALUES
  ('demo@example.com', '$2a$10$YourHashedPasswordHere', 'Demo User'),
  ('john@example.com', '$2a$10$YourHashedPasswordHere', 'John Doe'),
  ('sarah@example.com', '$2a$10$YourHashedPasswordHere', 'Sarah Smith')
ON CONFLICT (email) DO NOTHING;

-- Insert demo tasks
INSERT INTO tasks (title, description, status, priority, due_date, created_by, assigned_to) VALUES
  ('Setup Project Repository', 'Initialize the project with proper structure and dependencies', 'completed', 'high', NOW() + INTERVAL '1 day', 1, 1),
  ('Design Database Schema', 'Create ERD and design normalized database tables', 'in-progress', 'high', NOW() + INTERVAL '2 days', 1, 2),
  ('Implement Authentication', 'Add user login and registration functionality', 'pending', 'medium', NOW() + INTERVAL '5 days', 2, 2),
  ('Build Task Dashboard', 'Create main dashboard with task list and filters', 'pending', 'high', NOW() + INTERVAL '7 days', 1, 3),
  ('Add Real-time Features', 'Integrate Socket.io for live collaboration', 'pending', 'medium', NOW() + INTERVAL '10 days', 2, 1)
ON CONFLICT DO NOTHING;
