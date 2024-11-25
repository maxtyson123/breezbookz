import re

import requests

URL =  "https://www.paperplus.co.nz/storefinder/paperplusstoredetail/"
LIMIT = 100
EMAILS = []

def main():
    # Setup the file to store the data
    with open("paper_plus_emails.txt", "w") as f:
        f.write("")

    # Loop through the pages
    for i in range(1, LIMIT):

        # Get the URL
        url = f"{URL}{i}"

        # Get the page
        page = requests.get(url)

        # If it was not found, next
        if "<title>An error has occurred</title>" in page.text:
            print(url + " - Not Found")
            continue

        # If there is a h2 tag without a "CLOSED" in it, then it is a store
        if "<h2>CLOSED" in page.text:
            print(url + " - Store Closed")
            continue

        # Get the emails (whats inbetween the mailto: and the " symbol)
        emails = re.findall(r"mailto:(.*?)\"", page.text)
        for email in emails:
            EMAILS.append(email)
            with open("paper_plus_emails.txt", "a") as f:
                f.write(email + "\n")

        print(url + " - Found " + str(len(emails)) + " emails")
main()

