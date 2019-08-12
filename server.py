from flask import Flask, render_template,jsonify,json

app = Flask(__name__, static_folder="build/static", template_folder="build")
crashStr=open('src/geojson/crash-joined.json','r')
crashJsonData=json.load(crashStr)

predictionData=open('src/geojson/preds-viz.geojson','r')
predictionJson=json.load(predictionData)

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/crash")
def crash():
    
    return jsonify(data=crashJsonData)

@app.route('/prediction')
def prediction():
    return jsonify(data=predictionJson)

print('Starting Flask!')
app.debug=True
app.run(host='0.0.0.0')