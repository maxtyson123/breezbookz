from datetime import datetime

import requests
import json
import subprocess

# Constants
PRODUCT_URL = "https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts"
ACCOUNT_URL = "https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser"
PAYLOAD = json.dumps({
    "productIds": [
        "5104350-KGM-000",
        "5045849-KGM-000",
        "5005953-EA-000",
        "5086575-EA-000",
        "5001949-EA-000",
        "5045856-KGM-000",
        "5003744-EA-000",
        "5040464-EA-000",
        "5223140-KGM-000",
        "5046565-KGM-000",
        "5002588-EA-000",
        "5251947-EA-000",
        "5038667-EA-000",
        "5021440-EA-000",
        "5004861-EA-000",
        "5038284-EA-000",
        "5039354-EA-000",
        "5002760-EA-000",
        "5002679-EA-000",
        "5002547-EA-000",
        "5004590-EA-000",
        "5039956-EA-000",
        "5003846-EA-000",
        "5092664-EA-000",
        "5046611-KGM-000",
        "5268694-EA-000",
        "5040098-KGM-000",
        "5046440-EA-000",
        "5220069-EA-000",
        "5039965-KGM-000",
        "5039973-EA-000",
        "5002515-EA-000",
        "5221711-EA-000",
        "5040641-EA-000",
        "5013255-EA-000",
        "5046542-KGM-000",
        "5310072-EA-000",
        "5248791-EA-000",
        "5003808-EA-000",
        "5017889-EA-000",
        "5003840-EA-000",
        "5002586-EA-000",
        "5127149-EA-000"
    ]
})

print("BREEZBOOKZ Pak N Save Price Scaper v0.01")
print("=" * 40)

# Get the auth
print("Fetching user account...")
user = subprocess.check_output(['curl', 'https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser']).decode("utf-8")
user = json.loads(user)
print(f"    - Key expires at {user['expires_time']}")

# Create the payload
print(f"Creating item fetch payload...")
bearerToken = user["access_token"]
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + bearerToken,
}

# Fetch the data
print("Fetching product details...")
response = requests.request("POST", PRODUCT_URL, headers=headers, data=PAYLOAD)
data = response.json()
if (response.status_code != 200):
    print(" - Failed to fetch product details")
print(data)

# Print the info
print("Products found!")
print("=" * 40)
for i in data['products']:

    try:
        # Extract data
        id = i['productId']
        name = i['name']
        price = i['singlePrice']['comparativePrice']
        cents = price['pricePerUnit']
        dollar = cents / 100
        quantity_per = price['unitQuantity']
        unit = str(quantity_per) + price['unitQuantityUom']
        base_price = i['singlePrice']['price'] / 100
        base_quantity = (i['singlePrice']['price'] / cents) * quantity_per

    except Exception as e:
        print(e)
        print(i)
        continue

    # Round
    dollar = round(dollar, 2)
    base_price = round(base_price, 2)
    base_quantity = round(base_quantity, 1)

    print(
        f"Product ID: {i['productId']}, Name: {i['name']}, Price: ${dollar} per {unit} Base Unit: {base_quantity}{price['unitQuantityUom']} ${base_price}")
