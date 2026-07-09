#!/usr/bin/env python3
from urllib3 import disable_warnings
from argparse import ArgumentParser
from requests import post
from sys import stdin, argv
from time import sleep



disable_warnings()
onTheFly = {}
target = []
toSend = []

def go():
    for lines in stdin:
        line = lines.split()
        # payload = line.split()
        if len(line) != 0:
            if "Status" in line[0]:
                #TODO PASS STATUS TO THE NEXT BLOCK
                # status = line[1].replace(",", "")
                size = line[3].replace(",", "")
                print(size)
                
                if size not in onTheFly:
                    onTheFly[size] = {
                        "payloads": []
                    }


            if "http" in line[-1]:
                url = "/".join(line[-1].split("/")[:-1])
                payload = line[-1].split("/")[-1]
                print(url, payload)
                if url not in target:
                    target.append(url)
                
                if payload not in onTheFly:
                    onTheFly[size]["payloads"].append(payload)

    print("AQUI!")
    for key, value in onTheFly.items():
        dicts_length = len(value["payloads"])
        payload = value['payloads']
        print(dicts_length)
        if dicts_length <= 10:
            print(key, payload)
            #notify(key, payload)

    

def notify(key, payload):
    for word in payload:
        data = target[0]+"/"+word + " - " + key
        toSend.append(data)
    
    f = open(hook, "r")
    hooker = f.readlines()[0].strip()
    data = {"content": str(toSend)}
    x = post(hooker, json=data, headers={"Content-Type":"Application/json"}, verify=False)
    toSend.clear()

if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("-H", "--hook", metavar="", required=True)
    args = parser.parse_args()
    hook =  args.hook
    go()
