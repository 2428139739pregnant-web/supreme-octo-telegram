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
        o = o.replace('?v=5', '?v=6')
        o = o.replace('@c59c6848b92b42763907b7d2ac1f80f4d750672c/dist', '@84ac617324688bce5e2db0fd1ed89d2c14b11216/dist')
        return o
    return o

payload = patch(payload)
with open('孕尊世界.json', 'w', encoding='utf-8') as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)
print('OK wrote 孕尊世界.json')
print('top keys:', list(payload.keys()))
