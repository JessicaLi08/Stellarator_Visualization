from flask import Flask, render_template, request, jsonify
import draw_stel
import json

# !!flask logic done by chatgpt!!

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json

    # save input JSON
    with open("stellarator_input.json", "w") as f:
        json.dump(data, f)

    # run pyvista script
    subprocess.run(["python", "draw_stel.py"], check=True)

    return jsonify({"status": "ok"})

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
