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

## MarketInfo.ts

by this file you can get marketinfo data, here is data example:

    [["0x47c031236e19d024b42f8AE6780E44A573170703","0x47904963fc8b2340414262125aF798B9655E58Cd","0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f","0xaf88d065e77c8cC2239327C5EDb3A432268e5831
    "],"11831965847890605583781","0",[[["560715515574040017","284864548274716350415"],["9318127433809666","4817159949863388872"]],[["2021981442325287","7158762123411338456"],["23781730
    8715865997","311179606690263567739"]]],[true,"10114588798821048112553","10114588798821048112553",[["179582391

## tokens.ts

by this file you can parse the fundamental data from json file, these data you can use them to format the result

## how to use
after you execute the index.ts, you will get this result

    Market: POL|USDC
    borrowingFactorPerSecondForLongs: 1.4394848196378e-7
    borrowingFactorPerSecondForShorts: 0
    Is Long: false
    Next Value: 1048675.26749389820421552219