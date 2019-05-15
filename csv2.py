import csv
from pprint import pformat

def csv2py(filename, name):
    with open(filename) as fin:
        reader = csv.DictReader(fin)
        data = list(reader)
        return '\n%s = %s\n' % (name, pformat(data))

with open('data.py', 'w') as fout:
    fout.write('from collections import OrderedDict\n')
    fout.write(csv2py('kaarten.csv', 'cards'))
    fout.write(csv2py('symboliek.csv', 'symbols'))