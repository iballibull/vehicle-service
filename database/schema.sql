CREATE DATABASE IF NOT EXISTS vehicle_service
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vehicle_service;

-- Dealer users
CREATE TABLE dealers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service schedules
CREATE TABLE service_schedules (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  service_date DATE NOT NULL,
  service_time TIME NOT NULL,
  quota UNSIGNED INT NOT NULL,
  remaining_quota UNSIGNED INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_schedule (service_date, service_time),
  CHECK (remaining_quota >= 0)
);

-- Service bookings
CREATE TABLE service_bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  service_schedule_id BIGINT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  phone_no VARCHAR(20) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  license_plate VARCHAR(20) NOT NULL,
  vehicle_problem TEXT NOT NULL,
  status ENUM(
    'menunggu_konfirmasi',
    'konfirmasi_batal',
    'konfirmasi_datang',
    'tidak_datang',
    'datang'
  ) DEFAULT 'menunggu_konfirmasi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_schedule_id) REFERENCES service_schedules(id),
  INDEX idx_schedule (service_schedule_id)
);