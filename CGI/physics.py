import lhapdf
import urllib.parse

# Set LHAPDF verbosity to suppress citation printout
lhapdf.setVerbosity(0)

def parse_query_string(query_string):
    "Decode a query string into parameter lists"
    params = urllib.parse.parse_qs(query_string)
    pdfs = params.get('pdf', [None])[0].split(',')
    pids = params.get('pid', [''])[0].split(',')
    xs = params.get('x', [''])[0].split(',')
    Qs = params.get('Q', [''])[0].split(',')
    Q2s = params.get('Q2', [''])[0].split(',')
    return pdfs, pids, xs, Qs, Q2s

def get_pdf_values_outer_product(pdfs, pids, xs=None, Qs=None, Q2s=None):
    if Q2s and Q2s[0] != '':
        Qs = [float(q2)**0.5 for q2 in Q2s]
    elif Qs and Qs[0] != '':
        Qs = [float(q) for q in Qs]
    elif xs and xs[0] != '':
        pass
    else:
        return {'error': 'Either xs or Qs or Q2s must be provided'}, 400

    try:
        pids = list(map(int, pids))
        if xs:
            xs = list(map(float, xs))
        if Qs:
            Qs = list(map(float, Qs))
    except ValueError:
        return {'error': 'Invalid input parameters'}, 400

    results = {
        'pids': pids,
        'xs': xs if xs else [],
        'Qs': Qs if Qs else [],
        'Q2s': [Q**2 for Q in Qs] if Qs else [],
        'values': {}
    }

    for pdf in pdfs:
        p = lhapdf.mkPDF(pdf)
        pdf_result = {}

        as_result = []
        try:
            if Qs:
                as_result = [p.alphasQ(Q) for Q in Qs]
        except Exception as e:
            return {'error': str(e)}, 500
        pdf_result['alphas_values'] = as_result

        xf_result = []
        try:
            for pid in pids:
                xf_result_pid = []
                for x in xs if xs else [1]:
                    xf_result_x = [p.xfxQ(pid, x, Q) for Q in Qs] if Qs else [p.xfxQ(pid, x, 100.0)]
                    xf_result_pid.append(xf_result_x)
                xf_result.append(xf_result_pid)
        except Exception as e:
            return {'error': str(e)}, 600
        pdf_result['pdf_values'] = xf_result

        results['values'][pdf] = pdf_result

    return results, 200

def get_pdf_values_2d(pdf, pid, xs, Q2s):
    try:
        p = lhapdf.mkPDF(pdf)
    except Exception as e:
        return {'error': str(e)}, 500

    pdf_values = []
    for x in xs:
        row = []
        for Q2 in Q2s:
            Q = Q2**0.5
            try:
                value = p.xfxQ(pid, x, Q)
            except Exception as e:
                return {'error': str(e)}, 500
            row.append(value)
        pdf_values.append(row)

    return {
        'xs': xs,
        'Q2s': Q2s,
        'pdf_values': pdf_values
    }, 200

def get_available_pdfs():
    return lhapdf.availablePDFSets()
