import os
import json

# Path to your games folder
GAMES_FOLDER = "C:/Users/admin1/Desktop/wall puncher central/games"  # change this to your actual path

# Output file
OUTPUT_FILE = "games.txt"

games_list = []

# Scan the folder
for folder_name in os.listdir(GAMES_FOLDER):
    folder_path = os.path.join(GAMES_FOLDER, folder_name)
    if os.path.isdir(folder_path):
        games_list.append({
            "name": folder_name,
            "folder": f"{folder_name}/code"
        })

# Write to text file
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    for game in games_list:
        f.write(f'{{ name: "{game["name"]}", folder: "{game["folder"]}" }}\n')

print(f"Generated {OUTPUT_FILE} with {len(games_list)} entries.")
