CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  birthDate DATE NOT NULL,
  phone VARCHAR(50),
  userType ENUM('attorney','staff','client') NOT NULL DEFAULT 'client',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_number INT AUTO_INCREMENT DEFAULT 20260001,
  title VARCHAR(255) NOT NULL,
  summary TEXT,

  status ENUM('ongoing','closed','pending', 'appealed', 'dismissed') DEFAULT 'ongoing',
  priority ENUM('low', 'medium', 'high') DEFAULT 'high',

  practice_area VARCHAR(100),
  court VARCHAR(100),

  client_id INT NOT NULL,
  assigned_attorney INT,
  assigned_staff INT,

  filling_date DATE DEFAULT CURRENT_TIMESTAMP,
  close_date DATE DEFAULT null,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (assigned_attorney) REFERENCES users(id),
  FOREIGN KEY (assigned_staff) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS hearings (
  id INT AUTO_INCREMENT PRIMARY KEY,

  case_id INT NOT NULL,

  title VARCHAR(255) NOT NULL,
  description TEXT,

  hearing_type ENUM(
    'arraignment',
    'pre_trial',
    'trial',
    'motion',
    'appeal',
    'sentencing',
    'other'
  ) DEFAULT 'other',

  hearing_date DATETIME NOT NULL,
  location VARCHAR(255),

  status ENUM(
    'scheduled',
    'completed',
    'postponed',
    'cancelled'
  ) DEFAULT 'scheduled',

  outcome TEXT,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hearing_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,

  hearing_id INT NOT NULL,
  user_id INT NOT NULL,

  role ENUM(
    'client',
    'attorney',
    'staff'
  ) NOT NULL,

  FOREIGN KEY (hearing_id) REFERENCES hearings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE (hearing_id, user_id)
);
