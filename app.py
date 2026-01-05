from flask import Flask, render_template, request, jsonify
import draw_stel
import json
import matplotlib.pyplot as plt
import numpy as np

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_colormaps", methods=["GET"])
def get_colormaps():
    colormaps = {}
    cmap_names = ['bwr', 'viridis', 'plasma', 'turbo']
    
    for name in cmap_names:
        cmap = plt.get_cmap(name)
        # Sample 256 colors from the colormap
        colors = []
        for i in np.linspace(0, 1, 256):
            rgba = cmap(i)
            # Convert to 0-255 RGB
            rgb = [int(rgba[0] * 255), int(rgba[1] * 255), int(rgba[2] * 255)]
            colors.append(rgb)
        colormaps[name] = colors
    
    return jsonify(colormaps)

@app.route("/draw_stel", methods=["POST"])
def draw_stel_route():
    data = request.json

    rbc = data["rbc"]
    zbs = data["zbs"]
    nfp = data["nfp"]

    draw_stel.draw_stel(rbc, zbs, nfp)

    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5002)