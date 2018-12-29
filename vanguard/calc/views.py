from flask import request, render_template, jsonify, abort, current_app
import json
from vanguard import app
from collections import OrderedDict
from techlib.genutils import load_class, load_function
import os

@app.route('/calculations/')
def calc_index():
    return render_template("calc/index.html")

@app.route('/calculations/<category>/')
def calc_category_index(category):
    category_index_page = category + ".html"
    category_index_path = "calc/" + category_index_page
    return render_template(category_index_path)


@app.route('/htm/calculate/<path:calc_path>')
def htm_calculate(calc_path):
    curr_dir = os.path.dirname(os.path.abspath(__file__))
    calc_path = os.path.sep.join(calc_path.strip('/').split('/'))
    doc_html_path = os.path.join('root', calc_path, 'doc.html')
    doc_json_path = os.path.join(curr_dir, 'root', calc_path, 'doc.json')
    doc_json = json.load(open(doc_json_path), object_pairs_hook=OrderedDict)
    doc = json.dumps(doc_json, indent=4)
    return render_template(doc_html_path, doc=doc)


@app.route('/api/calculate/<path:calc_path>', methods=['POST'])
def api_calculate(calc_path):
    response={}
    try:
        req = request.get_json()
        docRaw = req['doc']
        curr_dir = os.path.dirname(os.path.abspath(__file__))
        calc_path = os.path.sep.join(calc_path.strip('/').split('/'))
        schema_path = os.path.join(curr_dir, 'root', calc_path, 'schema.py')
        macro_path = os.path.join(curr_dir, 'root', calc_path, 'macro.py')
        docSchema = load_class(schema_path, 'docSchema')
        docParsed = docSchema.load(docRaw)
        if (len(docParsed.errors) > 0):
            response['message'] = "Document Contains Errors"
            response["schema_errors"] = docParsed.errors
            return json_response(response), 400

        calculate = load_function(macro_path, 'calculate')
        doc = docParsed.data
        calculate(doc)
        #print(doc)
        #response['message'] = "Calculation Request Processed"
        response= doc
        return json_response(response)
    except Exception as e:
        response["message"] = "Error occcured during calculation"
        response["error_text"] = str(e)
        return json_response(response), 400



def json_response(input):
    str_response = json.dumps(input, indent=4)
    return current_app.response_class(str_response, mimetype='application/json')
