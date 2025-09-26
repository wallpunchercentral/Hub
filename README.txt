Wall Punchers Central v2 - Static Local Launcher (with microgames)
==================================================================

What's new:
- Three microgames included: Clicker Madness, Dodge the Block, Number Guess.
- Manifest syncing: games/games.json is loaded and cached in localStorage (wpc_manifest).
  If the cached manifest mismatches the file, it will be updated from games/games.json.
- Game progress saved per-game in localStorage (keys: progress_<folder>).
- /local/ folder included as an optional save area (browsers can't directly write to it).
- Mobile-friendly responsive layout.

Important font note:
- Replace assets/VT323-Regular.ttf with your actual VT323 font file (you mentioned you developed it).
  The placeholder file is included; please overwrite it with the real .ttf.

How to use:
1. Unzip the archive and keep the folder structure intact.
2. Replace assets/VT323-Regular.ttf with your real font file.
3. Open index.html in a browser (double-click). If you have issues with local file fetching, run a local server:
   python -m http.server
   and open http://localhost:8000/
4. Login with username 'tess' and password 'tickles'.
5. Play microgames from the Games page. Progress and high scores are saved in localStorage.

Adding games:
- Copy games/template to games/<your-folder>, edit dfg.json, replace image.png, add files in code/ and add an entry to games/games.json.
- The launcher will cache manifest in localStorage; if you edit games/games.json, refresh the page to sync.

Limitations:
- Static pages cannot write files into /local/ automatically. For file-based saves, run a local server and implement server-side endpoints.
- localStorage is per-browser and per-origin. If you open the same files via file:// and via http://localhost:8000, you'll have different storage.

If you'd like, I can:
- Add an option to export/import the localStorage manifest/progress as JSON files.
- Implement a small local-server script (Node or Python) that saves progress into /local/ when running a server.
- Add more polished UI or example games.

