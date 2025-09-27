#!/usr/bin/env python3
"""
Test script for the face recognition API
Usage: python test_api.py <path_to_register_image> <path_to_recognize_image>
"""

import requests
import sys
import os

API_BASE = "http://127.0.0.1:8001"

def test_face_recognition(register_image_path, recognize_image_path, user_name="testuser"):
    """Test the face recognition API with two images"""
    
    print(f"Testing face recognition API...")
    print(f"Register image: {register_image_path}")
    print(f"Recognize image: {recognize_image_path}")
    print(f"User name: {user_name}")
    print("-" * 50)
    
    # Test 1: Register a face
    print("1. Registering face...")
    try:
        with open(register_image_path, 'rb') as f:
            files = {'image': f}
            data = {'user_name': user_name}
            response = requests.post(f"{API_BASE}/register", files=files, data=data)
            
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.json().get('status') == 'registered':
            print("   ✅ Registration successful!")
        else:
            print(f"   ❌ Registration failed: {response.json().get('status')}")
            return
            
    except Exception as e:
        print(f"   ❌ Error during registration: {e}")
        return
    
    print()
    
    # Test 2: Recognize the face
    print("2. Recognizing face...")
    try:
        with open(recognize_image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(f"{API_BASE}/recognize", files=files)
            
        print(f"   Status Code: {response.status_code}")
        result = response.json()
        print(f"   Response: {result}")
        
        if result.get('status') == 'matched':
            print(f"   ✅ Recognition successful!")
            print(f"   👤 User: {result.get('user_name')}")
            print(f"   📊 Similarity: {result.get('similarity', 0):.2%}")
        else:
            print(f"   ❌ Recognition failed: {result.get('status')}")
            
    except Exception as e:
        print(f"   ❌ Error during recognition: {e}")

def main():
    if len(sys.argv) < 3:
        print("Usage: python test_api.py <register_image> <recognize_image> [user_name]")
        print("Example: python test_api.py photo1.jpg photo2.jpg myname")
        sys.exit(1)
    
    register_image = sys.argv[1]
    recognize_image = sys.argv[2]
    user_name = sys.argv[3] if len(sys.argv) > 3 else "testuser"
    
    # Check if files exist
    if not os.path.exists(register_image):
        print(f"Error: Register image '{register_image}' not found")
        sys.exit(1)
        
    if not os.path.exists(recognize_image):
        print(f"Error: Recognize image '{recognize_image}' not found")
        sys.exit(1)
    
    # Test the API
    test_face_recognition(register_image, recognize_image, user_name)

if __name__ == "__main__":
    main()
