# -*- coding: utf-8 -*-
import json

with open('孕尊世界.png', 'r', encoding='utf-8') as f:
    raw = f.read()

payload = json.loads(raw)

def patch(o):
    if isinstance(o, dict):
        return {k: patch(v) for k, v in o.items()}
    if isinstance(o, list):
        return [patch(x) for x in o]
    if isinstance(o, str):
        o = o.replace('testingcf.jsdelivr.net', 'cdn.jsdelivr.net')
        o = o.replace('?v=4', '?v=5')
        o = o.replace('@f4993fd7ed5d94fc6a81714f4f76321f0335f69d/dist', '@c59c6848b92b42763907b7d2ac1f80f4d750672c/dist')
        return o
    return o

payload = patch(payload)
with open('孕尊世界.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)
print('OK wrote 孕尊世界.json')
print('top keys:', list(payload.keys()))
