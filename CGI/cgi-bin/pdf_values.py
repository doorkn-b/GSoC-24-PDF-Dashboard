#!/usr/bin/env python3

import os
import sys
import json
import urllib.parse

# Add parent directory to path to find physics module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import physics

# Headers
print("Content-Type: application/json")
print()  # End of headers

try:
    # Get the query string from the CGI environment variable
    query_string = os.environ["QUERY_STRING"]  # sys.argv[1] for direct execution
    
    # Parse query string using the centralized function
    pdfs, pids, xs, Qs, Q2s = physics.parse_query_string(query_string)

    # Check for missing params
    if not pdfs:
        print(json.dumps({"error": "Missing required parameter 'pdf'. Please specify a PDF or PDFs."}, indent=4))
        exit()

    if not pids or not xs or (not Qs and not Q2s):
        print(json.dumps({"error": "Missing required parameters"}, indent=4))
        exit()

    # Get and return the physics data
    result, status_code = physics.get_pdf_values_outer_product(
        pdfs, pids, xs, Qs=Qs if Qs else None, Q2s=Q2s if Q2s else None
    )
    print(json.dumps(result, indent=4))

except Exception as e:
    print(json.dumps({"error": str(e)}, indent=4))
