import pymongo
from pymongo import MongoClient
from pymongoarrow.monkey import patch_all
from flask import Flask, request
from flask_cors import CORS
import json

patch_all()
from pymongoarrow.api import Schema
from pandas import DataFrame
import sys

class Trainer:
    def __init__(self):
        self.client = MongoClient('mongodb://mongodb/gekko')
        self.db = self.client.gekko.binance_candles

        self.schema = Schema({'_id': str,
                         'close': float,
                         'open': float,
                         'high': float,
                         'pair': str,
                         'low': float,
                         'start': int,
                         'time': int,
                         'trades': int,
                         'volume': float,
                         'vwp': float})

        self.history = []

    def getDataFrameFromRange(self, start, end):
        self.df = DataFrame(self.db.find_pandas_all({'start': {'$gte': start, '$lte': end}}, schema=self.schema))
        self.df = self.df.sort_values(by=['start'])
        return self.df

    def train(self):


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}}) # Allow cors anywhere

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/scanRange')
def getDatasetRange():
    minlist = list(trainer.db.find().sort("start", pymongo.ASCENDING).limit(1))
    maxlist = list(trainer.db.find().sort("start", pymongo.DESCENDING).limit(1))
    data = {"from": minlist[0]["start"], "to": maxlist[0]["start"]}
    return json.dumps(data)

@app.route('/loadData', methods=["POST"])
def loadDataFrame():
    fromEpoch = request.json["from"] / 1000
    toEpoch = request.json["to"] / 1000
    print("Loading dataset: " + str(fromEpoch) + " " + str(toEpoch))
    trainer.getDataFrameFromRange(fromEpoch, toEpoch)
    count = trainer.df.count()["start"]
    print("Dataset loaded. Entries: " + str(count))
    res = {"status": "Loaded", "size": int(str(count))}
    return res

@app.route('/train')
def trainModel():
    trainer.train()

if __name__ == '__main__':
    trainer = Trainer()
    app.run(debug=True)


