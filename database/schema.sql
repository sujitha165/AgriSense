-- AgriSense Database Schema
-- MySQL 8.0+ Compatible

CREATE DATABASE IF NOT EXISTS agrisense_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agrisense_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    location VARCHAR(120) DEFAULT 'Tamil Nadu, India',
    language VARCHAR(10) DEFAULT 'en', -- 'en', 'ta', 'te', 'hi'
    main_crop VARCHAR(80) DEFAULT 'Tomato',
    avatar_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Crop Scans Table
CREATE TABLE IF NOT EXISTS crop_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_url TEXT NOT NULL,
    crop VARCHAR(80) NOT NULL,
    disease VARCHAR(120) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL, -- e.g. 94.50%
    severity ENUM('Healthy', 'Low', 'Moderate', 'Severe') NOT NULL DEFAULT 'Moderate',
    symptoms JSON NULL,
    causes JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_crop_scans_user (user_id),
    INDEX idx_crop_scans_crop (crop),
    INDEX idx_crop_scans_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Treatments Table
CREATE TABLE IF NOT EXISTS treatments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT NOT NULL,
    user_id INT NOT NULL,
    immediate_action TEXT NOT NULL,
    treatment_plan JSON NOT NULL,
    prevention JSON NOT NULL,
    monitoring TEXT NOT NULL,
    expert_warning VARCHAR(255) DEFAULT 'For severe crop damage, consult a qualified agricultural expert.',
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES crop_scans(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_treatments_scan (scan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Crop Expenses & Profit Tracking Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crop VARCHAR(80) NOT NULL,
    land_area DECIMAL(8,2) NOT NULL, -- in Acres
    seed_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fertilizer_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    labor_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    pesticide_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    other_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (seed_cost + fertilizer_cost + labor_cost + pesticide_cost + other_cost) STORED,
    revenue DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    profit DECIMAL(10,2) GENERATED ALWAYS AS (revenue - (seed_cost + fertilizer_cost + labor_cost + pesticide_cost + other_cost)) STORED,
    season VARCHAR(50) DEFAULT 'Kharif',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_expenses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Government Agricultural Schemes Table
CREATE TABLE IF NOT EXISTS government_schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    benefits TEXT NOT NULL,
    category ENUM('Subsidy', 'Insurance', 'Loans', 'Central Government', 'State Government') NOT NULL,
    official_url VARCHAR(255) NULL,
    application_process TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('scan', 'treatment', 'scheme', 'system') DEFAULT 'system',
    link VARCHAR(255) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
