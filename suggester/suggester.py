import os.path
import requests

class _Char:
    def __init__(self, name):
        self.name = name
        self.alts = []
    
    def __repr__(self):
        return self.name

_chars = []
def Char(name):
    for char in _chars:
        if name == char.name or name in char.alts:
            return char
    char = _Char(name)
    _chars.append(char)
    return char

class _Ship:
    def __init__(self, chars, names):
        self.chars = chars
        self.names = names
        self.suggestions = []
    
    def __repr__(self):
        chars_out = ''
        for char in self.chars:
            chars_out += str(char) + '/'
        names_out = ''
        for name in self.names:
            names_out += name + ';'
        return chars_out[:-1] + ': ' + names_out[:-1]
    
    def ischars(self, chars):
        return all(char in self.chars for char in chars) and all(char in chars for char in self.chars)
    
    def hasname(self, name):
        return name in self.names

_ships = []
def Ship(chars, names):
    for ship in _ships:
        if ship.ischars(chars):
            return ship
    ship = _Ship(chars, names)
    _ships.append(ship)
    return ship

with open(os.path.dirname(__file__) + '/../ships.txt', 'r', encoding='utf8') as f:
    [Ship([Char(char) for char in line.split(': ')[0].split('/')], [name for name in line.split(': ')[1].replace('\n', '').split(';')]) for line in f.readlines()]

with open(os.path.dirname(__file__) + '/alts.txt', 'r', encoding='utf8') as f:
    for line in f.readlines():
        separator = line.replace('\n','').split(': ')
        char = Char(separator[0])
        char.alts.append(separator[1])

with open(os.path.dirname(__file__) + '/suggestions.csv', 'w', encoding='utf8') as f:
    r = requests.get('https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1AGS_7Pl_2mIz2LqMkpbiUFwax_4RlxWwYdaP-iNnkWw&exportFormat=csv')
    f.writelines(r.text.split('\n'))

class bcolors:
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

class Suggestion:
    def __init__(self, ship, name, new):
        self.ship = ship
        self.name = name
        self.new = new
    
    def approve(self):
        self.ship.names.append(self.name)
    
    def deny(self):
        if self.new:
            _ships.remove(self.ship)
    
    def __repr__(self):
        if self.new:
            return f'Suggesting {bcolors.BOLD}{bcolors.OKGREEN}{self.name}{bcolors.ENDC} for new ship {bcolors.BOLD}{bcolors.OKCYAN}{str(self.ship)[:-2]}{bcolors.ENDC}'
        else:
            return f'Suggesting {bcolors.BOLD}{bcolors.OKGREEN}{self.name}{bcolors.ENDC} for {bcolors.BOLD}{bcolors.OKBLUE}{self.ship}{bcolors.ENDC}'

suggestions = []

with open(os.path.dirname(__file__) + '/suggestions.csv', 'r', encoding='utf8') as f:
    for line in f.readlines():
        if line.startswith('Timestamp'):
            continue
        separator = line.replace('\n','').split(',')
        time = separator[0]
        chars = [Char(char) for char in separator[1].split('/')]
        name = separator[2].replace('`', ',').strip()
        ship = Ship(chars, None)
        if ship.names:
            if not ship.hasname(name):
                suggestions.append(Suggestion(ship, name, False))
        else:
            ship.names = []
            suggestions.append(Suggestion(ship, name, True))

if len(suggestions) == 0:
    print('No new suggestions!')

for suggestion in suggestions:
    print(suggestion)
    inp = input('Approve (y/n): ')
    if inp == 'y':
        suggestion.approve()
        print('Approved!')
    else:
        suggestion.deny()
        print('Denied!')

with open(os.path.dirname(__file__) + '/../ships.txt', 'w', encoding='utf8') as f:
    out = ''
    for ship in _ships:
        out += f'{ship}\n'
    f.write(out[:-1])