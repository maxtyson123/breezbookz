import os
import pyperclip
import requests
import json
import subprocess

# BUGS: Can bypass limit

# Constants
PRODUCT_URL = "https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts"
ACCOUNT_URL = "https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser"

print("BREEZBOOKZ Pak N Save Price Scaper v0.02")
print("=" * 40)

# Get the auth
print("Fetching user account...")
user = input("Enter your access_token: ")


js = ""



# Read all the json files in the folder
for filename in os.listdir("../recpies"):
    if filename.endswith(".json"):
        print(f"    - Reading {filename}")
        with open(f"../recpies/{filename}") as f:
            data = json.load(f)


            # Store the productIds
            productJson = {
                "productIds": []
            }

            # Get the productIds
            for i in data["ingredients"]:
                    id_item = i['id']
                    if id_item not in productJson["productIds"]:
                        productJson["productIds"].append(id_item)

            # Make the request
            print("    - Fetching product data...")
            headers = {
                "Authorization": f"Bearer {user}"
            }
            body = {
                "productIds": productJson["productIds"]
            }
            response = requests.post(PRODUCT_URL, headers=headers, json=body)
            productData = response.json()

            # Save the data
            with open(f"../recpies/prices_store/{filename}", "w") as f:
                json.dump(productData, f)


print("DONE!!!")