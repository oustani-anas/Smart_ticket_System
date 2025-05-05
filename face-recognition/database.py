import os
import psycopg2
from dotenv import load_dotenv
import numpy as np

load_dotenv()

def connect_db():
    """Établit une connexion à la base de données."""
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

def initialize_database():
    """Initialise la base de données avec les tables nécessaires."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS face_records (
            id VARCHAR PRIMARY KEY,
            user_name VARCHAR NOT NULL,
            embedding FLOAT[] NOT NULL
        );
        CREATE TABLE IF NOT EXISTS attendance_history (
            id VARCHAR,
            visitor_name VARCHAR,
            timing TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

def get_face_records():
    """Récupère tous les enregistrements de visages."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT id, user_name, embedding FROM face_records")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def add_face_record(user_id, user_name, embedding):
    """Ajoute un nouvel enregistrement de visage."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO face_records (id, user_name, embedding)
        VALUES (%s, %s, %s)
    """, (user_id, user_name, embedding))
    conn.commit()
    cur.close()
    conn.close()

def add_attendance_record(user_id, visitor_name, timing):
    """Ajoute un enregistrement de présence."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO attendance_history (id, visitor_name, timing)
        VALUES (%s, %s, %s)
    """, (user_id, visitor_name, timing))
    conn.commit()
    cur.close()
    conn.close()

def get_attendance_history():
    """Récupère l'historique des présences."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, visitor_name, timing
        FROM attendance_history
        ORDER BY timing DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def user_id_exists(user_id):
    """Vérifie si un ID utilisateur existe déjà."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM face_records WHERE id = %s", (user_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result is not None

def user_name_exists(user_name):
    """Vérifie si un nom d'utilisateur existe déjà."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT user_name FROM face_records WHERE user_name = %s", (user_name,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result is not None

def face_exists(embedding, threshold=0.75):
    """Vérifie si un visage existe déjà dans la base de données."""
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT embedding FROM face_records")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    for row in rows:
        existing_embedding = row[0]
        similarity = np.dot(embedding, existing_embedding) / (np.linalg.norm(embedding) * np.linalg.norm(existing_embedding))
        if similarity >= threshold:
            return True
    return False