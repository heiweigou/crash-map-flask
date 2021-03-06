from flask import Flask, render_template,jsonify,json
from operator import itemgetter
app = Flask(__name__, static_folder="build/static", template_folder="build")
crashStr=open('src/geojson/crash-joined.json','r')
crashJsonData=json.load(crashStr)

predictionData=open('src/geojson/preds-viz.geojson','r')
predictionJson=json.load(predictionData)

localityData=open('src/geojson/Locality_geojson.json','r')
localityJson=json.load(localityData)

def sortPredictionList(predictiondata):
    newlist =sorted(predictiondata['features'],key= lambda e:e['properties']['prediction'],reverse=True)  
    return newlist[:10]



@app.route('/')
def index():
    return render_template('index.html')


@app.route("/crash")
def crash():
    return jsonify(data=crashJsonData)

@app.route('/prediction')
def prediction():
    return jsonify(data=predictionJson,prediction=sortPredictionList(predictionJson))

@app.route('/locality/<str>')
def locality(str):
    features=localityJson['features']
    for feature in features:
        if feature['properties']['LOC_NAME'].lower()==str.lower():
            print (feature['properties']['LOC_NAME'])
            return jsonify(data=feature)
        
    return 'not found'
    

print('Starting Flask!')
app.debug=True
app.run(host='0.0.0.0')