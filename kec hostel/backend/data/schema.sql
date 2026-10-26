-- =======================================================
-- KEC HOSTELS MANAGEMENT SYSTEM - MySQL Database Schema
-- Kongu Engineering College, Perundurai, Erode - 638060
-- Version: 1.0 | Created: 2026
-- =======================================================

CREATE DATABASE IF NOT EXISTS kec_hostel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kec_hostel_db;

-- -------------------------------------------------------
-- TABLE: users
-- Stores students, caretakers, wardens, and admin accounts
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id               INT           NOT NULL AUTO_INCREMENT,
  name             VARCHAR(120)  NOT NULL,
  username         VARCHAR(80)   NOT NULL UNIQUE,
  roll_no          VARCHAR(20)   UNIQUE,
  email            VARCHAR(150)  NOT NULL UNIQUE,
  role             ENUM('student','caretaker','warden','admin') NOT NULL DEFAULT 'student',
  hostel           VARCHAR(100),
  room_no          VARCHAR(20),
  department       VARCHAR(120),
  year_of_study    VARCHAR(30),
  phone            VARCHAR(25),
  parent_phone     VARCHAR(25),
  password_hash    VARCHAR(255)  NOT NULL,
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_roll_no (roll_no),
  INDEX idx_role (role),
  INDEX idx_hostel (hostel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------
-- TABLE: hostels
-- Stores hostel block information
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostels (
  id                   VARCHAR(30)   NOT NULL,
  name                 VARCHAR(120)  NOT NULL,
  tagline              TEXT,
  capacity             INT           NOT NULL DEFAULT 0,
  occupied             INT           NOT NULL DEFAULT 0,
  floors               INT           NOT NULL DEFAULT 1,
  caretaker_name       VARCHAR(120),
  caretaker_contact    VARCHAR(25),
  facilities           JSON,
  image                VARCHAR(255),
  created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------
-- TABLE: rooms
-- Stores room-level occupancy data per hostel
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS rooms (
  id          INT           NOT NULL AUTO_INCREMENT,
  room_no     VARCHAR(20)   NOT NULL,
  hostel      VARCHAR(100)  NOT NULL,
  floor       INT           NOT NULL DEFAULT 1,
  capacity    INT           NOT NULL DEFAULT 4,
  occupied    INT           NOT NULL DEFAULT 0,
  status      VARCHAR(50)   NOT NULL DEFAULT 'Available',
  PRIMARY KEY (id),
  UNIQUE KEY uq_room_hostel (room_no, hostel),
  INDEX idx_hostel (hostel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------
-- TABLE: leave_requests
-- Tracks student outing and leave applications
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_requests (
  id               VARCHAR(20)   NOT NULL,
  student_id       INT           NOT NULL,
  student_name     VARCHAR(120)  NOT NULL,
  roll_no          VARCHAR(20),
  hostel           VARCHAR(100),
  room_no          VARCHAR(20),
  type             ENUM('Weekend Outing','Home Leave','Emergency Leave','Academic OD') NOT NULL DEFAULT 'Weekend Outing',
  from_date        DATE          NOT NULL,
  to_date          DATE          NOT NULL,
  purpose          TEXT          NOT NULL,
  parent_contact   VARCHAR(25),
  status           ENUM('Pending','Approved','Rejected')   NOT NULL DEFAULT 'Pending',
  applied_at       VARCHAR(30),
  approved_by      VARCHAR(120),
  remarks          TEXT,
  PRIMARY KEY (id),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_hostel (hostel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------
-- TABLE: complaints
-- Tracks maintenance and grievance tickets
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
  id               VARCHAR(20)   NOT NULL,
  student_id       INT           NOT NULL,
  student_name     VARCHAR(120)  NOT NULL,
  roll_no          VARCHAR(20),
  hostel           VARCHAR(100),
  room_no          VARCHAR(20),
  category         ENUM('Electrical','Plumbing','Wi-Fi / Internet','Carpentry','Mess / Dining','General') NOT NULL DEFAULT 'General',
  title            VARCHAR(255)  NOT NULL,
  description      TEXT          NOT NULL,
  status           ENUM('Pending','In Progress','Resolved')  NOT NULL DEFAULT 'Pending',
  assigned_to      VARCHAR(120),
  created_at       VARCHAR(30),
  PRIMARY KEY (id),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_hostel (hostel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -------------------------------------------------------
-- TABLE: notices
-- Official notices and announcements published by warden
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS notices (
  id             INT           NOT NULL AUTO_INCREMENT,
  title          VARCHAR(255)  NOT NULL,
  category       ENUM('General','Discipline','Mess Dining','Emergency','Maintenance') NOT NULL DEFAULT 'General',
  published_by   VARCHAR(120)  NOT NULL,
  date           DATE          NOT NULL,
  content        TEXT          NOT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_category (category),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =======================================================
-- SEED DATA: Demo accounts (bcrypt password_hash for student123 / caretaker123 / warden123 / admin123)
-- =======================================================

INSERT INTO users (name, username, roll_no, email, role, hostel, room_no, department, year_of_study, phone, parent_phone, password_hash)
VALUES
  ('Swaathi', 'swaathi', '22ITR088', 'swaathi.22itr@kongu.edu', 'student', 'Amaravathi Hostel', '204', 'Information Technology', 'III Year', '+91 94433 11223', '+91 94433 99887', '$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S.'),
  ('M. Selvam', 'caretaker.amaravathi', NULL, 'caretaker.amaravathi@kongu.edu', 'caretaker', 'Amaravathi Hostel', NULL, 'Hostel Administration', NULL, '+91 98421 33445', NULL, '$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S.'),
  ('Dr. K. Senthil', 'warden', NULL, 'warden@kongu.edu', 'warden', 'All Hostels', NULL, 'Chief Warden Office', NULL, '+91 98421 22222', NULL, '$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S.'),
  ('Hostel Chief Administrator', 'admin.hostel', NULL, 'admin.hostel@kongu.edu', 'admin', 'Campus Administration', NULL, 'Office of the Principal', NULL, '+91 4294 226555', NULL, '$2a$10$wN1Q/X3mRsmH091v7BZZye7Fqj02yM35WqY8C7cWz0n2Z4rO6y6S.')
ON DUPLICATE KEY UPDATE name = name;


INSERT INTO hostels (id, name, tagline, capacity, occupied, floors, caretaker_name, caretaker_contact, facilities, image)
VALUES
  ('amaravathi', 'Amaravathi Hostel', 'Eco-friendly, modern amenities with disciplined study halls and hygienic dining.', 450, 420, 4, 'M. Selvam', '+91 98421 33445', '["24x7 Purified RO Drinking Water","Wi-Fi Enabled Study Halls","Steam-Powered Hygienic Dining Hall","Solar Water Heaters","Indoor Badminton & Table Tennis"]', 'assets/hostel-amaravathi.png'),
  ('bhavani', 'Bhavani Hostel', 'Spacious multi-sharing rooms surrounded by green flora and round-the-clock security.', 500, 468, 4, 'P. Murugesan', '+91 98421 44556', '["High-Speed Campus LAN & Wi-Fi","Modern Gymnasium & Fitness Corner","Continuous CCTV Surveillance","Round-the-Clock Ambulance Support","Spacious Reading Room"]', 'assets/hostel-bhavani.png'),
  ('kaveri', 'Kaveri Hostel', 'Peaceful environment optimized for academic excellence and collaborative learning.', 420, 395, 3, 'S. Dharmaraj', '+91 98421 55667', '["Quiet Library Annex with e-Journals","Automated Laundry Stations","Doctor-on-Call & Health Post","Uninterrupted Power Backup (100 kVA DG)","Spacious Dining Complex"]', 'assets/hostel-kaveri.png')
ON DUPLICATE KEY UPDATE name = name;


INSERT INTO rooms (room_no, hostel, floor, capacity, occupied, status)
VALUES
  ('201', 'Amaravathi Hostel', 2, 4, 4, 'Full'),
  ('202', 'Amaravathi Hostel', 2, 4, 3, 'Available (1 Bed)'),
  ('203', 'Amaravathi Hostel', 2, 4, 4, 'Full'),
  ('204', 'Amaravathi Hostel', 2, 4, 4, 'Full'),
  ('205', 'Amaravathi Hostel', 2, 4, 2, 'Available (2 Beds)')
ON DUPLICATE KEY UPDATE status = status;


INSERT INTO notices (title, category, published_by, date, content)
VALUES
  ('Weekend Outing Cutoff Time Notification', 'General', 'Dr. K. Senthil (Chief Warden)', '2026-10-10', 'All resident students are hereby informed that Weekend Outing requests must be formally submitted through the portal before Friday 5:00 PM for warden approval. Entry gate closes at 7:00 PM strictly.'),
  ('Special Festive Dinner at Mess Dining Halls', 'Mess Dining', 'Mess Committee', '2026-10-08', 'A special traditional feast will be served on Saturday evening across all three hostels (Amaravathi, Bhavani, Kaveri). Dinner service hours extended until 9:30 PM.'),
  ('Annual Preventative Electrical & RO Plant Maintenance', 'Maintenance', 'Campus Maintenance Cell', '2026-10-05', 'Routine RO water filter overhaul will be conducted between 10:00 AM and 1:00 PM on Tuesday. Adequate clean water storage has been pre-arranged in each wing.')
ON DUPLICATE KEY UPDATE title = title;

-- =======================================================
-- END OF SCHEMA
-- =======================================================
