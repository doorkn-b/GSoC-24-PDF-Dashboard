import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Flask, request, jsonify, render_template
import physics
import lhapdf

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/available_pdfs', methods=['GET'])
def available_pdfs():
    try:
        pdf_sets = lhapdf.availablePDFSets()
        return jsonify(pdf_sets)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_members/<pdf_set>', methods=['GET'])
def get_members(pdf_set):
    try:
        pdf = lhapdf.mkPDF(pdf_set)
        members = pdf.size()  # Get the number of members in this PDF set
        return jsonify({"members": list(range(members))}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pdf_values', methods=['GET'])
def get_pdf_values():
    try:
        pdf_set = request.args.get('pdf')  # This fetches the value from the dropdown
        x_min = float(request.args.get('xMin')) if 'xMin' in request.args else None
        x_max = float(request.args.get('xMax')) if 'xMax' in request.args else None
        q_min = float(request.args.get('qMin')) if 'qMin' in request.args else None
        q_max = float(request.args.get('qMax')) if 'qMax' in request.args else None
        flavours = request.args.get('flavours').split(',')

        xs = [x_min + i * (x_max - x_min) / 100 for i in range(101)] if x_min and x_max else None
        Qs = [q_min + i * (q_max - q_min) / 100 for i in range(101)] if q_min and q_max else None

        if not pdf_set:
            return jsonify({"error": "Missing required parameter 'pdf'"}), 400

        if not flavours or not (xs or Qs):
            return jsonify({"error": "Missing required parameters"}), 400

        result, status_code = physics.get_pdf_values_outer_product(
            [pdf_set], flavours, xs=xs, Qs=Qs
        )
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pdf_values_2d', methods=['GET'])
def get_pdf_values_2d():
    try:
        pdf_set = request.args.get('pdf')  # Fetch the PDF set from the dropdown
        x_min = float(request.args.get('xMin')) if 'xMin' in request.args else None
        x_max = float(request.args.get('xMax')) if 'xMax' in request.args else None
        Q2_min = float(request.args.get('Q2Min')) if 'Q2Min' in request.args else None
        Q2_max = float(request.args.get('Q2Max')) if 'Q2Max' in request.args else None
        pid = int(request.args.get('pid'))

        if not (pdf_set and x_min is not None and x_max is not None and Q2_min is not None and Q2_max is not None and pid is not None):
            return jsonify({"error": "Missing required parameters"}), 400

        xs = [x_min + i * (x_max - x_min) / 100 for i in range(101)]
        Q2s = [Q2_min + i * (Q2_max - Q2_min) / 100 for i in range(101)]

        result, status_code = physics.get_pdf_values_2d(pdf_set, pid, xs, Q2s)
        return jsonify(result), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
