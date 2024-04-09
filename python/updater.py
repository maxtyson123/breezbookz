# Copy the files in ../recpies to ../website/public/data
import os

def copy_files():
    # Get the current directory
    current_dir = os.path.dirname(os.path.realpath(__file__))
    # Get the parent directory
    parent_dir = os.path.dirname(current_dir)
    # Get the directory of the recipes
    recipes_dir = os.path.join(parent_dir, 'recipes')
    # Get the directory of the website
    website_dir = os.path.join(parent_dir, 'website', 'public', 'data')
    # Get the list of files in the recipes directory
    files = os.listdir(recipes_dir)
    # Copy the files to the website directory
    for file in files:
        os.system(f'cp {os.path.join(recipes_dir, file)} {os.path.join(website_dir, file)}')
