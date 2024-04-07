import requests
import json

url = "https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts"

payload = json.dumps({
    "productIds": [
        "5046611-KGM-000",
        "5125914-KGM-000",
        "5201490-EA-000",
    ]
})
bearerToken = "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI3N2Q3NjZkMy0yNDViLTQ4ZmQtOWJlYi00ZWIzNjEyYmY1M2QiLCJpc3MiOiJvbmxpbmUtY3VzdG9tZXIiLCJzZXNzaW9uSWQiOiIzYjM5ZDRhOC1kZTdiLTQ0NjUtOTQzOC1iYmUwZDhmNmVkNjciLCJiYW5uZXIiOiJQTlMiLCJmaXJzdE5hbWUiOiJhbm9ueW1vdXMiLCJlbWFpbCI6ImFub255bW91cyIsInJvbGVzIjpbIkFOT05ZTU9VUyJdLCJleHAiOjE3MTI1MzMwMjZ9.MvV7xg1LCbvfn_fDNn5f5fHLfbUeQI7BCOaArqgh9bPkt7_v636lRl_LJRaECt02nWj18iEND7D3RbGszOpoKse9N1V5qaPhhGXDVcc5u9Dsb6gzNzV1B6rrNOrrxELeR3zHq2-mBwu3ZLY7qPusOxTWXd3iKw5n5yCN5enolxwUUCnlYQyS8pl5e5tSSKmz-U7e01b88NPn8_Z_GPIT-nOUGyjsvNUsjX1noVOZIJoB3ytT-Zdud4MJf-1oRFbRzW7DKsRclh2ylRZ4g2HE5n-PvjmPaZuyE9rdP8MHPTW5BZg2lzt1JEUIKfq-rmbQqdStFftpxtbiUjxV4dz4bQ"
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + bearerToken,
}

response = requests.request("POST", url, headers=headers, data=payload)


data = response.json()
for i in data['products']:

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

    # Round
    dollar = round(dollar, 2)
    base_price = round(base_price, 2)
    base_quantity = round(base_quantity, 1)

    print(f"Product ID: {i['productId']}, Name: {i['name']}, Price: ${dollar} per {unit} Base Unit: {base_quantity}{price['unitQuantityUom']} ${base_price}")
