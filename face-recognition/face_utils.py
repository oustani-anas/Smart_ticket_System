import cv2
import numpy as np
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
from test import test

class FaceProcessor:
    def __init__(self, device='cuda' if torch.cuda.is_available() else 'cpu'):
        """
        Initialise le processeur de visages.
        :param device: Le dispositif à utiliser ('cuda' pour GPU, 'cpu' pour CPU).
        """
        self.device = device
        # Initialisation de MTCNN pour la détection des visages
        self.mtcnn = MTCNN(image_size=160, margin=20, device=self.device)
        # Initialisation de ResNet pour l'extraction des embeddings
        self.resnet = InceptionResnetV1(pretrained='vggface2').eval().to(self.device)

    def get_face_embedding(self, img):
        """
        Extrait l'embedding d'un visage à partir d'une image.
        :param img: L'image (format numpy.ndarray ou PIL.Image).
        :return: L'embedding du visage (format numpy.ndarray) ou None si aucun visage n'est détecté.
        """
        if isinstance(img, np.ndarray):
            img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        try:
            # Détection du visage avec MTCNN
            face = self.mtcnn(img)
            if face is None:
                return None
            # Extraction de l'embedding avec ResNet
            face = face.to(self.device)
            with torch.no_grad():
                embedding = self.resnet(face.unsqueeze(0))
            return embedding.cpu().numpy()[0]
        except Exception as e:
            print(f"Erreur lors du traitement du visage : {e}")
            return None

    def calculate_similarity(self, embedding1, embedding2):
        """
        Calcule la similarité cosinus entre deux embeddings.
        :param embedding1: Le premier embedding.
        :param embedding2: Le deuxième embedding.
        :return: La similarité cosinus (entre 0 et 1).
        """
        emb1, emb2 = np.array(embedding1), np.array(embedding2)
        # Normalisation des embeddings
        emb1, emb2 = emb1 / np.linalg.norm(emb1), emb2 / np.linalg.norm(emb2)
        # Calcul de la similarité cosinus
        return np.dot(emb1, emb2)

    def detect_spoofing(self, img, model_path):
        """
        Détecte les tentatives de spoofing (faux visages).
        :param img: L'image à analyser.
        :param model_path: Le chemin vers le modèle anti-spoofing.
        :return: Le score de spoofing (1 = vrai visage, >1 = spoofing détecté).
        """
        return test(img, model_path, self.device)

    def crop_image_with_ratio(self, img, height, width, middle):
        """
        Recadre une image en fonction d'un ratio hauteur/largeur.
        :param img: L'image à recadrer.
        :param height: La hauteur du ratio.
        :param width: La largeur du ratio.
        :param middle: Le point central pour le recadrage.
        :return: L'image recadrée.
        """
        h, w = img.shape[:2]
        h = h - h % 4  # Ajustement de la hauteur
        new_w = int(h / height) * width  # Calcul de la nouvelle largeur
        startx = middle - new_w // 2  # Point de départ en x
        endx = middle + new_w // 2  # Point d'arrivée en x

        # Gestion des cas où le recadrage dépasse les limites de l'image
        if startx <= 0:
            cropped_img = img[0:h, 0:new_w]
        elif endx >= w:
            cropped_img = img[0:h, w - new_w:w]
        else:
            cropped_img = img[0:h, startx:endx]
        return cropped_img