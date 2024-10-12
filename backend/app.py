from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

import firebase_admin
from firebase_admin import credentials, firestore
import datetime

import os
from werkzeug.utils import secure_filename
from PIL import Image
import base64
from mistralai import Mistral
import logging
from config import API_KEY, MODEL_ID

# Set up Mistral API client
client = Mistral(api_key=API_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Initialize Firebase Firestore (assuming you already set up Firebase Admin)
cred = credentials.Certificate("./cachemoney-95b14-e8ba240701ef.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

@app.route('/api/test', methods=['GET'])
def get_data():
    # Return a JSON response with some sample data
    sample_data = {
        "name": "John Doe",
        "age": 30,
        "occupation": "Software Developer"
    }
    return jsonify(sample_data)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# api to add income to the database
# Needs {'uid', 'Amount', 'Category', 'Date', 'Frequency', 'Name']} in the request body
@app.route('/api/add_income', methods=['POST'])
def add_income():
    print("Income req received")
    try:
        # Get the data from the request
        data = request.json

        # Ensure that the request contains 'userid' and 'income'
        if 'uid' not in data:
            return jsonify({"error": "Missing 'userid' in request"}), 400
        
        userid = data['uid']
        
        # Verify that the required fields are in the income object
        required_fields = ['Amount', 'Category', 'Date', 'Frequency', 'Name']
        for field in required_fields:
            if field not in field:
                return jsonify({"error": f"Missing '{field}' in income data"}), 400

        # Convert the date string to a Firestore timestamp
        data['Date'] = datetime.datetime.strptime(income['Date'], "%d %B %Y at %H:%M:%S %Z")

        # Create a reference to the Firestore document path: users/{userid}/income/{auto_generated_id}
        income_ref = db.collection('users').document(userid).collection('income').document()

        # Add the income data to Firestore
        income_ref.set({
            "Amount": data['Amount'],
            "Category": data['Category'],
            "Date": data['Date'],
            "Frequency": data['Frequency'],
            "Name": data['Name']
        })

        # Return success response
        return jsonify({"success": True, "message": "Income added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/add_expense', methods=['POST'])
def add_expense():
    try:
        # Get the data from the request
        data = request.json

        # Ensure that the request contains 'userid' and 'expense'
        if 'uid' not in data:
            return jsonify({"error": "Missing 'userid' in request"}), 400
        
        userid = data['uid']
        
        # Verify that the required fields are in the expense object
        required_fields = ['amount', 'category', 'date', 'description', 'name']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing '{field}' in expense data"}), 400

        # Convert the date string to a Firestore timestamp
        data['date'] = datetime.datetime.strptime(data['date'], "%d %B %Y")

        # Create a reference to the Firestore document path: users/{userid}/expenses/{auto_generated_id}
        expense_ref = db.collection('users').document(userid).collection('expenses').document()

        # Add the expense data to Firestore
        expense_ref.set({
            "amount": data['amount'],
            "category": data['category'],
            "date": data['date'],
            "description": data['description'],
            "name": data['name']
        })

        # Return success response
        return jsonify({"success": True, "message": "Expense added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Process the image to extract text and return structured data in JSON format using Mistral API
    extracted_data = process_image(file_path)

    return jsonify(extracted_data)

def process_image(image_path):
    try:
        # Step 1: Resize and compress the image
        # resized_image_path = resize_and_compress_image(image_path)

        # if resized_image_path is None:
        #     return {"error": "Failed to process image"}

        # Step 2: Convert the image to Base64
        base64_image = encode_image(image_path)

        if base64_image is None:
            return {"error": "Failed to encode image"}

        # Step 3: Prepare the messages for Mistral API
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
                        Extract the following information from the provided image of a bill:
                        1. Total price or total amount of expense as a number!
                        2. Name of the expense
                        3. Date of the bill
                        4. A short description of the expense
                        5. Category of the bill with the options: ['Utility', 'Rent', 'Groceries', 'Entertainment', 'Other']

                        Return the extracted information with the following JSON fields:
                        "amount", "name", "date", "description", "category"
                        """
                    },
                    {
                        "type": "image_url",
                        "image_url": f"data:image/jpeg;base64,{base64_image}"
                    }
                ]
            }
        ]

        # Step 4: Call the Mistral API
        response = call_mistral_api(messages)

        if 'error' in response:
            return {"error": "Failed to get response from Mistral"}

        # Return the response as is since it will already be in JSON format
        return response

    except Exception as e:
        return {"error": str(e)}

def call_mistral_api(messages):
    """Call Mistral API with the given messages to extract bill info."""
    try:
        chat_response = client.chat.complete(
            model=MODEL_ID,
            messages=messages,
            response_format={"type": "json_object"}  # This ensures the response is in JSON format
        )

        # Return the extracted JSON from Mistral response
        return chat_response.choices[0].message.content

    except Exception as e:
        logging.error(f"Error during Mistral API call: {e}")
        return {"error": str(e)}

def resize_and_compress_image(image_path, max_size=(800, 800), quality=80):
    """Resize and compress image to reduce file size, converting RGBA to RGB if necessary."""
    try:
        with Image.open(image_path) as img:
            img.thumbnail(max_size)
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            img.save(image_path, format='JPEG', quality=quality)
        return image_path
    except Exception as e:
        logging.error(f"Error processing image {image_path}: {e}")
        return None
    
def encode_image(image_path):
    """Encode the image to Base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        logging.error(f"Error: The file {image_path} was not found.")
        return None

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
