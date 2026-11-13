Login API Testing

Endpoint: POST http://localhost:8181/api/auth/login

Command:
curl -X POST http://localhost:8181/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "johndoe@example.com",
  "password": "[REDACTED]"
}'

Output:
HTTP/1.1 200 OK
{"authtoken":"[REDACTED]"}

Result: Login API tested successfully.