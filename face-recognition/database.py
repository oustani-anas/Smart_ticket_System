import sqlite3
import json
from datetime import datetime
import os

DATABASE_FILE = "face_attendance.db"

def initialize_database():
    """Initialize the database with required tables."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    # Create face_records table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS face_records (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            embedding TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create attendance_records table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS attendance_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            user_name TEXT NOT NULL,
            timestamp TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES face_records (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def add_face_record(user_id, name, embedding):
    """Add a new face record to the database."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    # Convert embedding to JSON string
    embedding_json = json.dumps(embedding)
    
    cursor.execute('''
        INSERT INTO face_records (id, name, embedding)
        VALUES (?, ?, ?)
    ''', (user_id, name, embedding_json))
    
    conn.commit()
    conn.close()

def get_face_records():
    """Get all face records from the database."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, embedding FROM face_records')
    records = cursor.fetchall()
    
    # Convert JSON strings back to lists
    face_records = []
    for record in records:
        user_id, name, embedding_json = record
        embedding = json.loads(embedding_json)
        face_records.append((user_id, name, embedding))
    
    conn.close()
    return face_records

def add_attendance_record(user_id, user_name, timestamp):
    """Add an attendance record."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO attendance_records (user_id, user_name, timestamp)
        VALUES (?, ?, ?)
    ''', (user_id, user_name, timestamp))
    
    conn.commit()
    conn.close()

def user_name_exists(name):
    """Check if a user name already exists."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM face_records WHERE name = ?', (name,))
    count = cursor.fetchone()[0]
    
    conn.close()
    return count > 0

def face_exists(embedding):
    """Check if a face embedding already exists (with some tolerance)."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT embedding FROM face_records')
    records = cursor.fetchall()
    
    conn.close()
    
    # Simple check - in a real implementation, you'd want to use similarity comparison
    for record in records:
        existing_embedding = json.loads(record[0])
        # For now, just check if embeddings are exactly the same
        if existing_embedding == embedding:
            return True
    
    return False
