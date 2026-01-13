export const oldData = {
  loading: true,
  name: "Arijit Khan",
  responseTimestamp: "2025-12-30T10:10:14.356Z",
  error: {
    name: "Authentication Error",
    message: "User data not found"
  },
}

export  const data = {
    "error": false,
    "status": true,
    "statusCode": 200,
    "responseTimestamp": "2025-12-30T10:10:14.356Z",
    "data": {
        "_id": "6937fa594703aa9833250471",
        "organizationName": "ABC Org",
        "description": "This is a org",
        "ipAddress": "223.226.207.244",
        "timezone": "Asia/Kolkata",
        "domain": "abc.com",
        "createdBy": "68870f74869f7c9cfbccd0cd",
        "updatedBy": "68870f74869f7c9cfbccd0cd",
        "createdAt": "2025-12-09T10:30:49.989Z",
        "updatedAt": "2025-12-09T10:30:49.989Z",
        "user": {
            "_id": "6937fa5a4703aa9833250475",
            "name": "Abc Roy",
            "email": "abc@gmail.com",
            "role": "admin",
            "accessRights": [
                {
                    "module": "jobs",
                    "permissions": [
                        "read",
                        "delete",
                        "update",
                        "create"
                    ]
                },
                {
                    "module": "organization",
                    "permissions": [
                        "read",
                        "delete",
                        "update",
                        "create"
                    ]
                },
                {
                    "module": "user",
                    "permissions": [
                        "read",
                        "create",
                        "update",
                        "delete"
                    ]
                }
            ]
        }
    }
}
