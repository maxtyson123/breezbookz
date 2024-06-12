import requests

url = "http://localhost:8191/v1"
headers = {"Content-Type": "application/json"}
data = {
    "cmd": 'request.post',
    "maxTimeout": 60000,
    "url": 'https://www.paknsave.co.nz/CommonApi/Account/Login',
    "postData": 'email=max.tyson@wbhs.school.nz&password=Macty123!'

}
response = requests.post(url, headers=headers, json=data)
print(response.text)