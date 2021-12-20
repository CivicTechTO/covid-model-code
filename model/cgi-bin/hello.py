#!/usr/bin/python3

import cgi
import cgitb

cgitb.enable()

print("Content-type:text/html")
print()
print('<html>')
print('<head>')
print('<title>Hello World - First CGI Program</title>')
print('</head>')
print('<body>')

print('<h2>Hello World! This is my first CGI program</h2>')

form = cgi.FieldStorage()
if "fname" not in form:
    print("<H1>Error</H1>")
    print("Please fill in the name field.")
else:
    print("<p>name:", form["fname"].value)

print('</body>')
print('</html>')
