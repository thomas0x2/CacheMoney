from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import calendar

import os
from werkzeug.utils import secure_filename
from PIL import Image
import base64
from mistralai import Mistral
import logging
from config import API_KEY, MODEL_ID

import logging
logging.basicConfig(level=logging.DEBUG)
from dateutil.relativedelta import relativedelta

# Set up Mistral API client
client = Mistral(api_key=API_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Initialize Firebase Firestore (assuming you already set up Firebase Admin)
cred = credentials.Certificate("./cachemoney-95b14-e8ba240701ef.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

@app.route('/api/expense/last7days', methods=['GET'])
def get_last_7_days_expenses():
    try:
        # Get the 'userid' from the request arguments (URL query params)
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Calculate the date 7 days ago from now
        now = datetime.now()
        seven_days_ago = now - timedelta(days=7)

        # Firestore can handle Python's datetime object directly
        # Query Firestore for expenses in the last 7 days
        expenses_ref = db.collection('users').document(userid).collection('expenses')
        query = expenses_ref.where('Date', '>=', seven_days_ago).order_by('Date', direction=firestore.Query.DESCENDING)
        expenses = query.stream()

        # Collect the results into a list
        expenses_list = []
        for expense in expenses:
            expense_data = expense.to_dict()
            expenses_list.append({
                "id": expense.id,  # Include the document ID
                "amount": expense_data.get('Amount'),
                "category": expense_data.get('Category'),
                "date": expense_data.get('Date').strftime("%Y-%m-%d %H:%M:%S"),  # Convert timestamp to string
                "description": expense_data.get('Description'),
                "name": expense_data.get('Name')
            })

        return jsonify({"expenses": expenses_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/expense/last30days', methods=['GET'])
def get_last_30_days_expenses():
    try:
        # Get the 'userid' from the request arguments (URL query params)
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Calculate the date 7 days ago from now
        now = datetime.now()
        seven_days_ago = now - timedelta(days=30)

        # Firestore can handle Python's datetime object directly
        # Query Firestore for expenses in the last 7 days
        expenses_ref = db.collection('users').document(userid).collection('expenses')
        query = expenses_ref.where('Date', '>=', seven_days_ago).order_by('Date', direction=firestore.Query.DESCENDING)
        expenses = query.stream()

        # Collect the results into a list
        expenses_list = []
        for expense in expenses:
            expense_data = expense.to_dict()
            expenses_list.append({
                "id": expense.id,  # Include the document ID
                "amount": expense_data.get('Amount'),
                "category": expense_data.get('Category'),
                "date": expense_data.get('Date').strftime("%Y-%m-%d %H:%M:%S"),  # Convert timestamp to string
                "description": expense_data.get('Description'),
                "name": expense_data.get('Name')
            })

        return jsonify({"expenses": expenses_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500    

@app.route('/api/expense/last24hours', methods=['GET'])
def get_last_24_hours_expenses():
    try:
        # Get the 'userid' from the request arguments (URL query params)
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Calculate the date 24 hours ago from now
        now = datetime.now()
        twenty_four_hours_ago = now - timedelta(hours=24)

        # Firestore can handle Python's datetime object directly
        # Query Firestore for expenses in the last 24 hours
        expenses_ref = db.collection('users').document(userid).collection('expenses')
        query = expenses_ref.where('Date', '>=', twenty_four_hours_ago).order_by('Date', direction=firestore.Query.DESCENDING)
        expenses = query.stream()

        # Collect the results into a list
        expenses_list = []
        for expense in expenses:
            expense_data = expense.to_dict()
            expenses_list.append({
                "id": expense.id,  # Include the document ID
                "amount": expense_data.get('Amount'),
                "category": expense_data.get('Category'),
                "date": expense_data.get('Date').strftime("%Y-%m-%d %H:%M:%S"),  # Convert timestamp to string
                "description": expense_data.get('Description'),
                "name": expense_data.get('Name')
            })

        return jsonify({"expenses": expenses_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/all_expenses', methods=['GET'])
def get_all_expenses():
    try:
        # Get the 'userid' from the query parameters
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Get the current date
        now = datetime.now()

        # Query Firestore for all expenses up to the current date
        expenses_ref = db.collection('users').document(userid).collection('expenses')
        expenses_query = expenses_ref.where('Date', '<=', now).order_by('Date', direction=firestore.Query.DESCENDING)
        expenses = expenses_query.stream()

        # Collect expenses into a list
        expenses_list = []
        for expense in expenses:
            expense_data = expense.to_dict()
            expenses_list.append({
                "id": expense.id,  # Include the document ID
                "amount": expense_data.get('Amount'),
                "category": expense_data.get('Category'),
                "date": expense_data.get('Date').strftime("%Y-%m-%d %H:%M:%S"),
                "description": expense_data.get('Description'),
                "name": expense_data.get('Name')
            })

        return jsonify({"expenses": expenses_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/monthly-income', methods=['GET'])
def get_monthly_income():
    try:
        # Get the 'userid' from the query parameters
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Get the current date
        now = datetime.now()

        # Get the first and last day of the current month
        first_day_of_month = datetime(now.year, now.month, 1)
        last_day_of_month = datetime(now.year, now.month, calendar.monthrange(now.year, now.month)[1])

        # Initialize total for monthly income
        total_monthly_income = 0

        ### Query Firestore for incomes in the current month
        income_ref = db.collection('users').document(userid).collection('income')
        income_query = income_ref.where('Date', '>=', first_day_of_month).where('Date', '<=', last_day_of_month)
        incomes = income_query.stream()

        # Sum up the total monthly income
        for income in incomes:
            income_data = income.to_dict()
            total_monthly_income += income_data.get('Amount', 0)

        # Return the total income for the current month
        return jsonify({
            "total_monthly_income": total_monthly_income
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/monthly-income-last6months', methods=['GET'])
def get_monthly_income_last_6_months():
    try:
        # Get the 'userid' from the query parameters
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Initialize a dictionary to store income for the last 6 months
        monthly_income = {}

        # Get the current date
        now = datetime.now()

        # Loop through the last 6 months
        for i in range(6):
            # Get the first day of the current month (offset by i months)
            current_month = now - relativedelta(months=i)
            first_day_of_month = datetime(current_month.year, current_month.month, 1)
            last_day_of_month = datetime(current_month.year, current_month.month, calendar.monthrange(current_month.year, current_month.month)[1])

            # Initialize total for the month's income
            total_monthly_income = 0

            ### Query Firestore for incomes within the current month
            income_ref = db.collection('users').document(userid).collection('income')
            income_query = income_ref.where('Date', '>=', first_day_of_month).where('Date', '<=', last_day_of_month)
            incomes = income_query.stream()

            # Sum up the total income for the current month
            for income in incomes:
                income_data = income.to_dict()
                total_monthly_income += income_data.get('Amount', 0)

            # Add the total monthly income to the dictionary
            month_key = f"{current_month.year}-{current_month.month:02d}"  # E.g., "2024-10"
            monthly_income[month_key] = total_monthly_income

        # Return the aggregated monthly income for the last 6 months
        return jsonify(monthly_income), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/monthly-savings-last6months', methods=['GET'])
def get_monthly_savings_last_6_months():
    try:
        # Get the 'userid' from the query parameters
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Initialize a dictionary to store savings for the last 6 months
        monthly_savings = {}

        # Get the current date
        now = datetime.now()

        # Loop through the last 6 months
        for i in range(6):
            # Get the first and last days of the current month (offset by i months)
            current_month = now - relativedelta(months=i)
            first_day_of_month = datetime(current_month.year, current_month.month, 1)
            last_day_of_month = datetime(current_month.year, current_month.month, calendar.monthrange(current_month.year, current_month.month)[1])

            # Initialize totals for the month's income and expenses
            total_monthly_income = 0
            total_monthly_expenses = 0

            ### Query Firestore for incomes within the current month
            income_ref = db.collection('users').document(userid).collection('income')
            income_query = income_ref.where('Date', '>=', first_day_of_month).where('Date', '<=', last_day_of_month)
            incomes = income_query.stream()

            # Sum up the total income for the current month
            for income in incomes:
                income_data = income.to_dict()
                total_monthly_income += income_data.get('Amount', 0)

            ### Query Firestore for expenses within the current month
            expenses_ref = db.collection('users').document(userid).collection('expenses')
            expenses_query = expenses_ref.where('Date', '>=', first_day_of_month).where('Date', '<=', last_day_of_month)
            expenses = expenses_query.stream()

            # Sum up the total expenses for the current month
            for expense in expenses:
                expense_data = expense.to_dict()
                total_monthly_expenses += expense_data.get('Amount', 0)

            # Calculate monthly savings
            monthly_savings_value = total_monthly_income - total_monthly_expenses

            # Add the monthly savings to the dictionary
            month_key = f"{current_month.year}-{current_month.month:02d}"  # E.g., "2024-10"
            monthly_savings[month_key] = {
                "income": total_monthly_income,
                "expenses": total_monthly_expenses,
                "savings": monthly_savings_value
            }

        # Return the aggregated monthly savings for the last 6 months
        return jsonify(monthly_savings), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/all_incomes', methods=['GET'])
def get_all_incomes():
    try:
        # Get the 'userid' from the query parameters
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Get the current date
        now = datetime.now()

        # Query Firestore for all incomes up to the current date
        income_ref = db.collection('users').document(userid).collection('income')
        income_query = income_ref.where('Date', '<=', now).order_by('Date', direction=firestore.Query.DESCENDING)
        incomes = income_query.stream()

        # Collect incomes into a list
        income_list = []
        for income in incomes:
            income_data = income.to_dict()
            income_list.append({
                "id": income.id,  # Include the document ID
                "amount": income_data.get('Amount'),
                "category": income_data.get('Category'),
                "date": income_data.get('Date').strftime("%Y-%m-%d %H:%M:%S"),
                "frequency": income_data.get('Frequency'),
                "name": income_data.get('Name')
            })

        return jsonify({"incomes": income_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/financial_summary', methods=['GET'])
def get_financial_summary():
    try:
        # Get the 'userid' from the query parameters
        userid = request.args.get('userid')

        if not userid:
            return jsonify({"error": "Missing 'userid' in query parameters"}), 400

        # Get the current date
        now = datetime.now()

        # Initialize totals for income and expenses
        total_income = 0
        total_expenses = 0

        ### Query Firestore for all incomes up to the current date
        income_ref = db.collection('users').document(userid).collection('income')
        income_query = income_ref.where('Date', '<=', now).order_by('Date', direction=firestore.Query.DESCENDING)
        incomes = income_query.stream()

        # Sum up the total income
        for income in incomes:
            income_data = income.to_dict()
            total_income += income_data.get('Amount', 0)

        ### Query Firestore for all expenses up to the current date
        expenses_ref = db.collection('users').document(userid).collection('expenses')
        expenses_query = expenses_ref.where('Date', '<=', now).order_by('Date', direction=firestore.Query.DESCENDING)
        expenses = expenses_query.stream()

        # Sum up the total expenses
        for expense in expenses:
            expense_data = expense.to_dict()
            total_expenses += expense_data.get('Amount', 0)

        # Calculate savings
        savings = total_income - total_expenses

        # Return the aggregated totals and savings
        return jsonify({
            "total_income": total_income,
            "total_expenses": total_expenses,
            "savings": savings
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        required_fields = ['Amount', 'Category', 'Date', 'Description', 'Name']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing '{field}' in expense data"}), 400

        # Convert the Date string to a Firestore timestamp
        data['Date'] = datetime.datetime.strptime(data['Date'], "%d %B %Y")

        # Create a reference to the Firestore document path: users/{userid}/expenses/{auto_generated_id}
        expense_ref = db.collection('users').document(userid).collection('expenses').document()

        # Add the expense data to Firestore
        expense_ref.set({
            "Amount": data['Amount'],
            "Category": data['Category'],
            "Date": data['Date'],
            "Description": data['Description'],
            "Name": data['Name']
        })

        # Return success response
        return jsonify({"success": True, "message": "Expense added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
                        3. Date of the bill in the format "YYYY-MM-DD"
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
