import json
import sys
import time
import matplotlib.pyplot as plt

# External
COBY_COOKING_RECPIE_TIME_MILI   = 62220000              # 17 HR
MAX_WEBSITE_TIME_MILI           = 165600000 + 3180000   # 46 HR 53 MIN
MAX_BOOK_DESIGN_TIME_MILI       = 46800000 + 1800000    # 13 HR 30 MIN
COBY_BOOK_DESIGN_TIME_MILI      = 7200000 + 1800000     # 2 HR 30 MIN

YES_KERIKERI_TRADE_FARE_TIME_MILI =  21600000 + 1800000 # 6 hr 30 min (Max, Coby, William)
YES_KERIKERI_REGIONAL_TIME_MILI   =  25200000           # 7 hr  (Max, Coby, Liam)


def makeJson():
    # Read the file
    jsonData = json.load(open('bb.json'))

    # File Paths
    file_paths = json.load(open('files.json'))

    # Check if any files are missing
    missing_files = []
    for path in file_paths:
        found = False
        for file in jsonData:
            if path.split("/")[-1].replace(' ', '_').replace('.', '_').replace('(', '_').replace(')', '_').replace(')', '_').replace("'", "_") == file.split("_file_name-")[1]:
                found = True
                break
        if not found:
            missing_files.append(path)
    for file in missing_files:
        print(f"File not found: {file}")
    if len(missing_files) == 0:
        print("All files found")

    # Create new JSON data
    newJsonData = []

    # Go through each item in the JSON data
    for file in jsonData:

        # Create a new entry for the file
        name = file.split("_file_name-")[1]

        for path in file_paths:
            if path.split("/")[-1].replace(' ', '_').replace('.', '_').replace('(', '_').replace(')', '_').replace(')', '_').replace("'", "_") == name:
                name = path
                break

        if "Song" in name:
            continue

        data = {
                "name": name,
                "revisions": [],
                "usermap": {}
            }

        # Go through each revision in the file
        prev_endMillis = None
        for revision in jsonData[file]:

            # Get the revision
            rev = json.loads(revision.split("\n")[1])

            # Go through each revision and add it to the data
            for r in rev['tileInfo']:

                # For each user in the revision, replace the user with the user's name
                for i in range(len(r['users'])):
                    if r['users'][i] in rev['userMap']:
                        r['users'][i] = rev['userMap'][r['users'][i]]['name']

                # Add the revision to the data
                data["revisions"].append(r)

                # Clean up the data
                data["revisions"][-1].pop('systemRevs', None)
                data["revisions"][-1].pop('expandable', None)
                data["revisions"][-1].pop('revisionMac', None)


            # Add the revision user map
            for user in rev['userMap']:
                data["usermap"][user] = rev['userMap'][user]

                #  Clean up the data
                data["usermap"][user].pop('photo', None)
                data["usermap"][user].pop('defaultPhoto', None)
                data["usermap"][user].pop('expandable', None)

        # Add the data to the new JSON data
        newJsonData.append(data)

    # Save to a nicely indented JSON file
    with open('revisions.json', 'w') as f:
        json.dump(newJsonData, f, indent=4)

    return newJsonData;

def addExternalTimes(jd):


    # Add external times
    jd.append({
        "name": "Cooking Recipe",
        "revisions": [],
        "usermap": {},
        "combined_times": [{
            "start": 0,
            "end": COBY_COOKING_RECPIE_TIME_MILI,
            "length": COBY_COOKING_RECPIE_TIME_MILI,
            "date": time.ctime(0),
            "users": [
                "Coby Jones",
            ],
        }]
    })

    jd.append({
        "name": "Website",
        "revisions": [],
        "usermap": {},
        "combined_times": [{
            "start": 0,
            "end": MAX_WEBSITE_TIME_MILI,
            "length": MAX_WEBSITE_TIME_MILI,
            "date": time.ctime(0),
            "users": [
                "Max Tyson",
            ],
        }]
    })

    jd.append({
        "name": "Book Design",
        "revisions": [],
        "usermap": {},
        "combined_times": [{
            "start": 0,
            "end": MAX_BOOK_DESIGN_TIME_MILI,
            "length": MAX_BOOK_DESIGN_TIME_MILI,
            "date": time.ctime(0),
            "users": [
                "Max Tyson",
            ],
            },
            {
            "start": 0,
            "end": COBY_BOOK_DESIGN_TIME_MILI,
            "length": COBY_BOOK_DESIGN_TIME_MILI,
            "date": time.ctime(0),
            "users": [
                "Coby Jones",
            ],
            }
        ]
    })

    jd.append({
        "name": "Yes Kerikeri Trade Fare",
        "revisions": [],
        "usermap": {},
        "combined_times": [{
            "start": 0,
            "end": YES_KERIKERI_TRADE_FARE_TIME_MILI,
            "length": YES_KERIKERI_TRADE_FARE_TIME_MILI,
            "date": time.ctime(0),
            "users": [
                "Max Tyson",
                "Coby Jones",
                "William Renes",
            ],
        }]
    })

    jd.append({
        "name": "Yes Kerikeri Regional",
        "revisions": [],
        "usermap": {},
        "combined_times": [{
            "start": 0,
            "end": YES_KERIKERI_REGIONAL_TIME_MILI,
            "length": YES_KERIKERI_REGIONAL_TIME_MILI,
            "date": time.ctime(0),
            "users": [
                "Max Tyson",
                "Coby Jones",
                "Liam Rosemergy",
            ],
        }]
    })

    return jd

def calcFileTimes(jd):
    # Loop through each file
    for file in jd:

        revisions = file["revisions"]

        combined_times = []


        # get the user names from the revision
        users = []
        for i in range(len(revisions)):
            for user in revisions[i]['users']:
                if user not in users:
                    users.append(user)

        # Go through each user and count their time
        for user in users:

            start_time = revisions[0]['endMillis']
            end_time = revisions[0]['endMillis']

            for i in range(1, len(revisions)):

                rev = revisions[i]

                # If the user is in the revision, add the time to the range
                if user not in rev['users']:
                    continue

                current_time = rev['endMillis']
                if (current_time - end_time) <= 300000:
                    # If the current time is within 5 minutes of the end time, extend the end time
                    end_time = current_time
                else:
                    # If the current time is more than 10 minutes from the end time, finalize the current range
                    combined_times.append({
                        "start": start_time,
                        "end": end_time,
                        "length": end_time - start_time,
                        "date": time.ctime(start_time / 1000),
                        "users": [user],
                    })
                    # Start a new range
                    start_time = current_time
                    end_time = current_time

        # Append the last range
        combined_times.append({
            "start": start_time,
            "end": end_time,
            "length": end_time - start_time,
            "date": time.ctime(start_time / 1000),
            "users": revisions[-1]['users'],
        })

        # Save the combined times to the file
        file["combined_times"] = combined_times

    # Add the external times
    return addExternalTimes(jd)

def printTime(milliseconds):

    # Find the closest time unit to the milliseconds
    if milliseconds < 1000:
        return f"{milliseconds} milliseconds"
    elif milliseconds < 60000:
        return f"{milliseconds / 1000:.2f} seconds"
    elif milliseconds < 3600000:
        return f"{milliseconds / 1000 / 60:.2f} minutes"
    elif milliseconds < 86400000:
        return f"{milliseconds / 1000 / 60 / 60:.2f} hours"
    else:
        return f"{milliseconds / 1000 / 60 / 60 / 24:.2f} days ({milliseconds / 1000 / 60 / 60:.2f} hours)"



def printTotals(jd):

    print("===")
    print("Totals")
    print("===")

    # Data to print
    total_time = 0
    total_revisions = 0
    total_files = len(jd)
    total_user_time = {}

    # Loop through each file
    for file in jd:

        # Add the amount of revisions to the total
        total_revisions += len(file['revisions'])

        # Print the combined times
        for ct in file['combined_times']:
            total_time += ct['length']

            for user in ct['users']:
                if user in total_user_time:
                    total_user_time[user] += ct['length']
                else:
                    total_user_time[user] = ct['length']

    print(f"Total Time: {printTime(total_time)}")
    print(f"Total Revisions: {total_revisions}")
    print(f"Total Files: {total_files}")
    print(f"Total Users: {len(total_user_time)}")

    for user in total_user_time:
        print(f"{user}: {printTime(total_user_time[user])}, {total_user_time[user] / total_time * 100:.2f}%")

    # Remove users with less than 1% of the total
    total_user_time = {k: v for k, v in total_user_time.items() if v / total_time > 0.01}

    # defining labels
    names = [user for user in total_user_time]

    # portion covered by each label
    slices = [total_user_time[user] for user in total_user_time]

    # color for each label
    colors = ['r', 'y', 'g', 'b']

    # plotting the pie chart
    plt.pie(slices, labels = names, colors=colors,
            startangle=90, shadow = True,
            radius = 1.2, autopct = '%1.1f%%')

    # showing the plot
    plt.show()

def printIndividualUsers(jd):

    print("===")
    print("Users")
    print("===")

    # Loop through each file
    for file in jd:

        total_user_time = {}
        total_time = 1


        # Print the file name
        print(f" - File: {file['name']}")

        # Print the combined times
        for ct in file['combined_times']:
            total_time += ct['length']
            for user in ct['users']:
                if user in total_user_time:
                    total_user_time[user] += ct['length']
                else:
                    total_user_time[user] = ct['length']

        # Print the user times rounded to 2 decimal places
        for user in total_user_time:
            print(f"   - {user}: {printTime(total_user_time[user])}, {total_user_time[user] / total_time * 100:.2f}%")

def main():

    # Process the JSON data
    jd = makeJson()
    jd = calcFileTimes(jd)

    # Print the JSON data
    printTotals(jd)
    printIndividualUsers(jd)


    print("Done")


if __name__ == "__main__":
    main()
