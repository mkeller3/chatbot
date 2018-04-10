greetings = ['hello','hi','hey']
closest = ['closest','close','near']
within = ['within']
def parseIntents(userInput):
    if any(userInput.find(greeting)>=0 for greeting in greetings):
        print 'Hi there, how can I help you?'
    if any(userInput.find(close)>=0 for close in closest):
        print 'near'
    if any(userInput.find(withs)>=0 for withs in within):
        print 'within'

count = 1
while count > 0:
    userInput = raw_input("What do you want to know?")
    parseIntents(userInput)
