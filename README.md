# GmxSniper README

## index.ts

Run this command "nohup ts-node index.ts > output.log 2>&1 &"
Then this script will be starting to listen to all the EventLog1 evens, for example "OpenInterestUpdated" event.
**Event received:**
msgSender: 0xB0Fc2a48b873da40e7bc25658e5E6137616AC2Ee
eventName: OpenInterestUpdated
eventNameHash: 0x00196834ad19e18bcab573766c501e3a5cf9a022e5fc21614e0dc7655b7e9c8f
topic1: 0x00000000000000000000000047c031236e19d024b42f8ae6780e44a573170703
eventData: [[[["market","0x47c031236e19d024b42f8AE6780E44A573170703"],["collateralToken","0xaf88d065e77c8cC2239327C5EDb3A432268e5831"]],[]],[[["nextValue","41458205439508593024621185058880012909"]],[]],[[["delta","-129221102434973316034678597340160000"]],[]],[[["isLong",true]],[]],[[],[]],[[],[]],[[],[]]]
So then you can parse this event data 

## blank

blank
