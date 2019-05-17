import requests

url     = "http://10.0.10.69/api/drive/time"
payload = {"LinearVelocity":0,"AngularVelocity":55,"TimeMS":800}
headers = { 'Content-Type': 'application/json'}
res = requests.post(url, json=payload, headers=headers)
res.raise_for_status()