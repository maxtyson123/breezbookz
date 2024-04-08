import os

import requests
import json
import subprocess

# BUGS: Can bypass limit

# Constants
PRODUCT_URL = "https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts"
ACCOUNT_URL = "https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser"

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
payload_product = {
    "productIds": [
    ]
}

# Read all the json files in the folder
for filename in os.listdir("../recpies"):
    if filename.endswith(".json"):
        print(f"    - Reading {filename}")
        with open(f"../recpies/{filename}") as f:
            data = json.load(f)
            for i in data["ingredients"]:
                if "multi_option" in i:
                    for j in i["multi_option"]:
                        id_item = j['id']
                        if id_item not in payload_product["productIds"]:
                            payload_product["productIds"].append(id_item)
                else:
                    id_item = i['id']
                    if id_item not in payload_product["productIds"]:
                        payload_product["productIds"].append(id_item)
PAYLOAD = json.dumps(payload_product)

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
        id_item = i['productId']
        name = i['name']

        # Check if comparative price exists
        if 'comparativePrice' in i['singlePrice']:
            price = i['singlePrice']['comparativePrice']
            cents = price['pricePerUnit']
            quantity_per = price['unitQuantity']
            unit = price['unitQuantityUom']

        elif 'variableWeight' in i:
            cents = i['singlePrice']['price']
            quantity_per = 1
            unit = "kg"
        else:
            cents = i['singlePrice']['price']
            quantity_per = 1
            unit = "ea"



        base_price = i['singlePrice']['price'] / 100
        base_quantity = (i['singlePrice']['price'] / cents) * quantity_per

    except Exception as e:
        print(e)
        print(i)
        continue

    # Round
    dollar = round(cents / 100, 2)
    base_price = round(base_price, 2)
    base_quantity = round(base_quantity, 0)

    print(
        f"Product ID: {i['productId']}, Name: {i['name']}, Price: ${dollar} per {quantity_per}{unit} Base Unit: "
        f"{base_quantity}{unit} ${base_price}")
