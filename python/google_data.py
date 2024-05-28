import json

import pyperclip
import requests
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
SERVICE_ACCOUNT_FILE = 'breez-bookz-b4c8f459fc68.json'

# Authenticate using the service account file
flow = InstalledAppFlow.from_client_secrets_file(
    'a.json', SCOPES)
credentials = flow.run_local_server(port=0)

# Build the Drive API service
service = build('drive', 'v2', credentials=credentials)

token = 'AC4w5Vgo4SA0oogx9A5ekqc32zAxIciTkg:1716884037825'

# Create js to store the responses
js = ["a = {};"]

marketing_mix = '19V9i5YCDo5-tja2KDfK-CbksvvmtdCFCOn4hibDxGs0'
ROOTFOLDER = "1lbTfH1vS2nBaWLi3oL2vPVKLpzdUfqG5"
def getrevisions(file_id, name):

    # Setup a to contain the id
    name = name.replace(' ', '_').replace('.', '_').replace('(', '_').replace(')', '_').replace(')', '_').replace("'", "_")
    aID = f"file_id-{file_id}_file_name-{name}"
    js[0] += f"a['{aID}'] = [];"

    # List the revisions of the file
    try:
        revisions = service.revisions().list(fileId=file_id).execute()
        items = revisions.get('items', [])

        if not items:
            # print('No revisions found.')
            return
        else:
            for x in range(len(items)):
                item = items[x]
                revision_id = item['id']
                modified_time = item.get('modifiedDate', 'Unknown')
                modified_by = item.get('lastModifyingUser', {}).get('displayName', 'Unknown')
                email = item.get('lastModifyingUser', {}).get('emailAddress', 'Unknown')

                # print(f"Revision ID: {revision_id}, "
                #       f"Modified Time: {modified_time}, "
                #       f"Modified By: {modified_by}, "
                #       f"Email: {email}"
                #       )

        start_id = 1
        end_id = items[-1]['id']

        # print(f"Start ID: {start_id}, End ID: {end_id}")

        # Print the range of revisions (broken down into sets of 2000 as a max difference)
        current_id = start_id
        while current_id != end_id:
            next_id = int(current_id) + 2000
            if next_id > int(end_id):
                next_id = end_id

            # Get the URL for the revision range
            url = f"https://docs.google.com/document/d/{file_id}/revisions/tiles?start={current_id}&end={next_id}&token={token}&showDetailedRevisions=true"
            js[0] += f"a['{aID }'].push(await fetch('{url}').then(r => r.text()));"

            # print(f"Range: {current_id} - {next_id}")
            current_id = next_id




    except Exception as e:
        print(f"An error occurred: {e}")


def gatherFolder(folder_id, indent=0):

    # Query to get files in the specified folder
    query = f"'{folder_id}' in parents"

    # List files in the folder
    try:
        results = service.files().list(
            q=query,
        ).execute()
        items = results.get('items', [])

        if not items:
             print('No files found.')
        else:
            for item in items:
                folder = 'application/vnd.google-apps.folder' in item['mimeType']
                file = 'application/vnd.google-apps.document' in item['mimeType']


                if folder:
                    print(f"{'-' * indent}Folder: {item['title']}")
                    gatherFolder(item['id'] , indent + 1)

                if file:
                    print(f"{'-' * indent}File: {item['title']}")
                    getrevisions(item['id'], item['title'])

    except Exception as e:
        print(f"An error occurred: {e}")


def main():

    gatherFolder(ROOTFOLDER)

    # Add js to download the revisions as a JSON file
    js[0] += "await fetch('data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(a))).then(r => r.blob()).then(blob => {let a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'revisions.json'; a.click();});"

    # Copy the js to the clipboard
    pyperclip.copy(js[0])
    print("DONE!!!")


if __name__ == "__main__":
    main()
