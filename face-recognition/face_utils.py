import cv2
import numpy as np
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
import os

class FaceProcessor:
    def __init__(self):
        """Initialize the face processor with MTCNN and FaceNet models."""
        # Initialize MTCNN for face detection
        self.mtcnn = MTCNN(keep_all=True, device='cpu')
        
        # Initialize FaceNet for face recognition
        self.facenet = InceptionResnetV1(pretrained='vggface2').eval()
        
        # Anti-spoofing is disabled for now due to missing model files
        self.anti_spoof_enabled = False
        
    def detect_spoofing(self, image, model_path):
        """Detect if the face is a spoof (fake)."""
        # Anti-spoofing is disabled for now
        print("Anti-spoofing is disabled. Returning 0 (no spoof detected).")
        return 0  # Return 0 (no spoof) - disabled for now
    
    def get_face_embedding(self, image):
        """Extract face embedding from an image."""
        try:
            # Convert BGR to RGB if needed
            if len(image.shape) == 3 and image.shape[2] == 3:
                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            else:
                image_rgb = image
            
            # Detect faces using MTCNN
            boxes, probs = self.mtcnn.detect(image_rgb)
            
            if boxes is None or len(boxes) == 0:
                return None
            
            # Get the face with highest confidence
            best_face_idx = np.argmax(probs)
            box = boxes[best_face_idx]
            
            # Extract face region
            x1, y1, x2, y2 = box.astype(int)
            face_img = image_rgb[y1:y2, x1:x2]
            
            if face_img.size == 0:
                return None
            
            # Resize face to 160x160 for FaceNet
            face_img = cv2.resize(face_img, (160, 160))
            
            # Convert to tensor and normalize
            face_tensor = torch.tensor(face_img).permute(2, 0, 1).float()
            face_tensor = (face_tensor - 127.5) / 128.0
            face_tensor = face_tensor.unsqueeze(0)
            
            # Extract embedding
            with torch.no_grad():
                embedding = self.facenet(face_tensor)
                embedding = embedding.squeeze().numpy()
            
            return embedding
            
        except Exception as e:
            print(f"Error extracting face embedding: {e}")
            return None
    
    def calculate_similarity(self, embedding1, embedding2):
        """Calculate cosine similarity between two face embeddings."""
        try:
            # Convert to numpy arrays if they aren't already
            emb1 = np.array(embedding1)
            emb2 = np.array(embedding2)
            
            # Calculate cosine similarity
            dot_product = np.dot(emb1, emb2)
            norm1 = np.linalg.norm(emb1)
            norm2 = np.linalg.norm(emb2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            similarity = dot_product / (norm1 * norm2)
            return float(similarity)
            
        except Exception as e:
            print(f"Error calculating similarity: {e}")
            return 0.0
    
    def crop_image_with_ratio(self, image, width_ratio, height_ratio, center_x):
        """Crop image with specific aspect ratio around center point."""
        try:
            height, width = image.shape[:2]
            
            # Calculate crop dimensions
            crop_width = int(width * width_ratio / 100)
            crop_height = int(height * height_ratio / 100)
            
            # Calculate crop boundaries
            x1 = max(0, center_x - crop_width // 2)
            x2 = min(width, center_x + crop_width // 2)
            y1 = max(0, height // 2 - crop_height // 2)
            y2 = min(height, height // 2 + crop_height // 2)
            
            # Crop the image
            cropped = image[y1:y2, x1:x2]
            
            return cropped
            
        except Exception as e:
            print(f"Error cropping image: {e}")
            return image
