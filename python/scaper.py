import requests
import json

url = "https://api-prod.newworld.co.nz/v1/edge/store/529d66cc-60e3-432e-b8d1-efc9f2ec4919/decorateProducts"

payload = json.dumps({
    "productIds": [
        "5046611-KGM-000",
        "5125914-KGM-000"
    ]
})
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI5ZTVhNWJlMy1jNTc4LTQyMTQtYmZjZS05MGVkNzBlNzUzNDQiLCJpc3MiOiJvbmxpbmUtY3VzdG9tZXIiLCJzZXNzaW9uSWQiOiIzYjM5ZDRhOC1kZTdiLTQ0NjUtOTQzOC1iYmUwZDhmNmVkNjciLCJiYW5uZXIiOiJQTlMiLCJmaXJzdE5hbWUiOiJhbm9ueW1vdXMiLCJlbWFpbCI6ImFub255bW91cyIsInJvbGVzIjpbIkFOT05ZTU9VUyJdLCJleHAiOjE3MTI1MzEzMTB9.O2hWD8LHVhzAngKEaRZnsef889EwzTcwrGw9vifOWNQOD3p9tMRb7ydBXkoP3AK2R4CpKtsy1BJSJOWr9uN-1AiD4KC0e5XpZ2f25poNToTheXS5wVKpnvg1NncfiFofiG4H5b2xRFJLyqLIn0FFqFjtDXZkgPCONfUUIkXwCf7EfMsA4P9jN93un_godE8NZjQkqQaTwMjgrFT5CWtzVCrrY9Zaei5WGTLDIIsrMJEhlBHIoLZU1WFxwvk3Ts7U0NheJ_LOvbcubfpj3bRVf51p3FAyeJ6voIcV-MTiqeb80lBuGwcgR0KV_5ii1cAZfsjh2pW1G6ke_Nt4WjMkfg'
}

response = requests.request("POST", url, headers=headers, data=payload)


data = response.json()
for i in data['products']:
    print(i)
    print(i['productId'], i['name'], i['price']['price'], i['price']['currency'])
