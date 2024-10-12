from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
from PIL import Image
# import pytesseract

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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

    # Process the image to extract text using pytesseract
    extracted_data = process_image(file_path)

    return jsonify(extracted_data)

def process_image(image_path):
    try:
        # Open image and apply pytesseract to extract text
        img = Image.open(image_path)
        extracted_text = pytesseract.image_to_string(img)

        # Here you can add logic to parse the extracted text for specific fields
        # Example logic to simulate extracted fields from the text:
        return {
            "name": "Sample Expense",
            "amount": "100",
            "date": "2024-10-12",
            "description": "Description from the bill",
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    app.run(debug=True)
