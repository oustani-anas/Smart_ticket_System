import tkinter as tk
from tkinter import messagebox, simpledialog, ttk, Toplevel, Scrollbar
import cv2
from PIL import Image, ImageTk
from datetime import datetime
import database
from face_utils import FaceProcessor
import uuid
import re

class App:
    def __init__(self, main_window):
        self.main_window = main_window
        self.main_window.title("Face Attendance System")
        self.main_window.geometry("900x600+350+180")
        self.main_window.configure(bg="#ffebee")

        # Titre de l'application
        self.title_label = tk.Label(self.main_window, text="Face Attendance System", font=("Comic Sans MS", 32, "bold"),
                                    bg="#ffebee", fg="#d81b60")
        self.title_label.pack(pady=10)

        # Cadre pour la webcam
        self.webcam_frame = tk.Frame(self.main_window, bg="#ffffff", bd=2, relief=tk.RAISED)
        self.webcam_frame.place(x=10, y=70, width=700, height=500)

        self.webcam_label = tk.Label(self.webcam_frame)
        self.webcam_label.pack(fill=tk.BOTH, expand=True)
        self.add_webcam(self.webcam_label)

        # Cadre pour les boutons
        self.button_frame = tk.Frame(self.main_window, bg="#f8bbd0", bd=3, relief=tk.GROOVE)
        self.button_frame.place(x=750, y=70, width=200, height=500)

        # Boutons
        self.start_recognition_button = self.create_button(self.button_frame, "Reconnaissance", "#ffccbc",
                                                           self.recognize_face)
        self.register_button = self.create_button(self.button_frame, "Enregistrer", "#ff8a65",
                                                  self.register_new_user)
        self.list_user_button = self.create_button(self.button_frame, "Liste", "#ff8a65",
                                                  self.show_registered_users)
        self.exit_button = self.create_button(self.button_frame, "Quitter", "#ffab91", self.exit_app)

        # Initialisation des composants
        self.face_processor = FaceProcessor()
        self.confidence_threshold = 0.75
        self.anti_spoof_model_path = "resources/anti_spoof_models"

    def create_button(self, parent, text, color, command):
        """Crée un bouton stylisé."""
        button = tk.Button(parent, text=text, bg=color, fg="#ffffff", font=("Comic Sans MS", 14, "bold"),
                           command=command, width=15, height=2)
        button.pack(pady=10)
        return button

    def add_webcam(self, label):
        """Ajoute la webcam à l'interface."""
        try:
            if 'cap' not in self.__dict__:
                self.cap = cv2.VideoCapture(0)
            self._label = label
            self.process_webcam()
        except Exception as e:
            messagebox.showerror("Erreur", f"Impossible d'ouvrir la webcam : {e}")

    def process_webcam(self):
        """Affiche le flux vidéo de la webcam."""
        try:
            ret, frame = self.cap.read()
            if ret:
                self.most_recent_capture_arr = frame
                img_ = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                self.most_recent_capture_pil = Image.fromarray(img_)
                imgtk = ImageTk.PhotoImage(image=self.most_recent_capture_pil)
                self._label.imgtk = imgtk
                self._label.configure(image=imgtk)
            self._label.after(20, self.process_webcam)
        except Exception as e:
            print(f"Erreur lors du traitement de la webcam : {e}")

    def recognize_face(self):
        """Reconnaît un visage et enregistre la présence."""
        frame = self.most_recent_capture_arr.copy()
        faces = self.face_processor.mtcnn.detect(frame)

        # Vérifier si des visages sont détectés
        if faces[0] is None:
            messagebox.showinfo("Information", "Aucun visage détecté !")
            return

        boxes, _ = faces
        boxes = boxes.astype(int)

        for x1, y1, x2, y2 in boxes:
            cropped_img = self.face_processor.crop_image_with_ratio(frame, 4, 3, (x1 + x2) // 2)
            spoof = self.face_processor.detect_spoofing(cropped_img, self.anti_spoof_model_path)

            if spoof > 1:
                messagebox.showerror("Erreur", "Tentative de spoofing détectée !")
                return

            embedding = self.face_processor.get_face_embedding(cropped_img)
            if embedding is not None:
                best_match = self.find_best_match(embedding)
                if best_match:
                    user_id, similarity = best_match
                    if similarity >= self.confidence_threshold:
                        user_name = self.get_user_name(user_id)
                        messagebox.showinfo("Succès", f"Bonjour, {user_name} ! Similitude : {similarity:.2%}")
                        database.add_attendance_record(user_id, user_name, datetime.now())
                    else:
                        messagebox.showerror("Erreur", "Utilisateur inconnu.")
                else:
                    messagebox.showerror("Erreur", "Utilisateur inconnu.")

    def find_best_match(self, embedding):
        """Trouve la meilleure correspondance pour un embedding donné."""
        face_records = database.get_face_records()
        if not face_records:
            return None

        similarities = [(user_id, self.face_processor.calculate_similarity(embedding, record_embedding))
                        for user_id, _, record_embedding in face_records]

        similarities.sort(key=lambda x: x[1], reverse=True)

        if similarities:
            return similarities[0]
        return None

    def get_user_name(self, user_id):
        """Récupère le nom d'un utilisateur à partir de son ID."""
        face_records = database.get_face_records()
        for record_id, record_name, _ in face_records:
            if record_id == user_id:
                return record_name
        return "Inconnu"

    def register_new_user(self):
        """Enregistre un nouvel utilisateur."""
        user_name = simpledialog.askstring("Input", "Nom de l'utilisateur (lettres uniquement) :")
        if user_name:
            if not re.match("^[a-zA-Z]+$", user_name):
                messagebox.showerror("Erreur", "Le nom doit contenir uniquement des lettres.")
                return

            # Vérifier si le nom existe déjà
            if database.user_name_exists(user_name):
                messagebox.showerror("Erreur", f"L'utilisateur {user_name} existe déjà.")
                return

            # Capturer l'embedding du visage
            frame = self.most_recent_capture_arr.copy()
            embedding = self.face_processor.get_face_embedding(frame)
            if embedding is None:
                messagebox.showerror("Erreur", "Aucun visage détecté.")
                return

            # Convertir l'embedding en liste si nécessaire
            if not isinstance(embedding, list):
                embedding = embedding.tolist()

            # Vérifier si le visage existe déjà
            if database.face_exists(embedding):
                messagebox.showerror("Erreur", "Cet utilisateur est déjà enregistré.")
                return

            # Enregistrer le nouvel utilisateur
            user_id = str(uuid.uuid4())
            database.add_face_record(user_id, user_name, embedding)
            messagebox.showinfo("Succès", f"Utilisateur {user_name} enregistré avec succès ! ID : {user_id}")

    def show_registered_users(self):
        """Affiche la liste des utilisateurs enregistrés."""
        users_window = Toplevel(self.main_window)
        users_window.title("Liste des utilisateurs enregistrés")
        users_window.geometry("600x400")

        # Cadre pour la liste et la barre de défilement
        frame = tk.Frame(users_window)
        frame.pack(fill=tk.BOTH, expand=True)

        # Barre de défilement
        scrollbar = Scrollbar(frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Liste des utilisateurs
        user_list = tk.Listbox(frame, yscrollcommand=scrollbar.set, font=("Comic Sans MS", 12))
        user_list.pack(fill=tk.BOTH, expand=True)

        # Récupérer les utilisateurs enregistrés
        face_records = database.get_face_records()
        for user_id, user_name, _ in face_records:
            user_list.insert(tk.END, f"ID: {user_id} - Nom: {user_name}")

        # Configurer la barre de défilement
        scrollbar.config(command=user_list.yview)

    def exit_app(self):
        """Ferme l'application."""
        self.cap.release()
        self.main_window.quit()
        self.main_window.destroy()

if __name__ == "__main__":
    database.initialize_database()
    root = tk.Tk()
    app = App(root)
    root.mainloop()