import json
import time
import matplotlib.pyplot as plt

MAX_WEBSITE_TIME_MILI = 151200000


def makeJson():
    # Read the file
    jsonData = json.load(open('bb.json'))

    # Create new JSON data
    newJsonData = []

    # Go through each item in the JSON data
    for file in jsonData:

        # Create a new entry for the file
        data = {
            "name": file.split("_file_name-")[1],
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


def calcFileTimes(jd):
    # Loop through each file
    for file in jd:

        revisions = file["revisions"]

        combined_times = []
        start_time = revisions[0]['endMillis']
        end_time = revisions[0]['endMillis']

        for i in range(1, len(revisions)):
            current_time = revisions[i]['endMillis']
            if (current_time - end_time) <= 600000:
                # If the current time is within 10 minutes of the end time, extend the end time
                end_time = current_time
            else:
                # If the current time is more than 10 minutes from the end time, finalize the current range
                combined_times.append({
                    "start": start_time,
                    "end": end_time,
                    "length": end_time - start_time,
                    "date": time.ctime(start_time / 1000),
                    "users": revisions[i - 1]['users'],
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

    # Add the website time to the JSON data
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

    # Add the cooking recipe time to the JSON data
    RECIPES_TIME_MILI_PER = 3000000
    COBY_DONE = 33
    MAX_DONE = 3

    jd.append({
        "name": "Cooking Recipes",
        "revisions": [],
        "usermap": {},
        "combined_times": [{
            "start": 0,
            "end": RECIPES_TIME_MILI_PER * COBY_DONE,
            "length": RECIPES_TIME_MILI_PER * COBY_DONE,
            "date": time.ctime(0),
            "users": [
                "Coby Jones",
            ],
        }, {
            "start": 0,
            "end": RECIPES_TIME_MILI_PER * MAX_DONE,
            "length": RECIPES_TIME_MILI_PER * MAX_DONE,
            "date": time.ctime(0),
            "users": [
                "Max Tyson",
            ],
        }]
    })

    # Designing the book
    BOOK_TIME_MILI = 39600000
    jd.append({
        "name": "Designing the Book",
        "revisions": [],
        "usermap": {},
        "combined_times": [{
            "start": 0,
            "end": BOOK_TIME_MILI,
            "length": BOOK_TIME_MILI,
            "date": time.ctime(0),
            "users": [
                "Max Tyson",
            ],
        }]
    })


    return jd

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
