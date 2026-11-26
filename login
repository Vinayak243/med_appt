

cURL command:
curl -i -X POST http://localhost:8181/api/auth/login -H 'Content-Type: application/json' -d '{"email":"task16_1795698248@example.com","password":"Test@12345"}'

Login response:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0100   309  100   244  100    65   2610    695 --:--:-- --:--:-- --:--:--  3322
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 244
ETag: W/"f4-n8UjEK2Y2ZDJn/zo+i3FqdHJGqo"
Date: Thu, 26 Nov 2026 13:09:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"success":true,"message":"Login successful.","authtoken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmIwODJlNDg0OTc4MjVlYzM1NDg4Njk1In0sImlhdCI6MTc5NTY5ODU3MSwiZXhwIjoxNzk1Nzg0OTcxfQ.DT-c-q9sXHOMcGL5Pv5cQQerdcrT4xvlM3cxLyGczNI"}