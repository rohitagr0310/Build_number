### **Error Codes for API Responses**

This document provides the error codes and their meanings that the backend API will send in responses. These error codes should be used in the frontend to handle errors consistently.

#### **Error Codes**

| **Code** | **Message**           | **Description**                                                                                                                 |
| -------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 200      | Success               | The request was successful and the response contains the expected data.                                                         |
| 400      | Bad Request           | The request was malformed or invalid. The frontend should validate the input before sending the request.                        |
| 401      | Unauthorized          | The user is not authorized to perform this action. This may require the user to log in or obtain proper credentials.            |
| 403      | Forbidden             | The user does not have permission to access the requested resource.                                                             |
| 404      | Not Found             | The requested resource does not exist. This could mean a missing entity or URL.                                                 |
| 409      | Already Exists        | The resource being created already exists. Typically used when trying to create a resource that already exists in the database. |
| 422      | Validation Error      | The request failed validation. This is used for validation errors such as missing required fields or invalid input formats.     |
| 500      | Internal Server Error | A server-side error occurred. The user should be informed that something went wrong and should try again later.                 |

#### **How to Handle Errors on the Frontend**

The frontend should handle these errors by checking the `statusCode` in the API response and acting accordingly.

**Example:**

```javascript
axios
  .post("/api/commodity", commodityData)
  .then((response) => {
    // Handle success
    console.log(response.data.message);
  })
  .catch((error) => {
    if (error.response) {
      const { statusCode, message } = error.response.data;
      switch (statusCode) {
        case 200:
          // Success: Handle the successful response
          break;
        case 400:
          // Bad Request: Inform the user to check their input
          alert("Bad Request: " + message);
          break;
        case 404:
          // Not Found: Inform the user the requested resource does not exist
          alert("Not Found: " + message);
          break;
        case 409:
          // Already Exists: Inform the user that the item already exists
          alert("Conflict: " + message);
          break;
        case 422:
          // Validation Error: Inform the user about input issues
          alert("Validation Error: " + message);
          break;
        default:
          // Internal Server Error or other unexpected errors
          alert("An unexpected error occurred: " + message);
          break;
      }
    } else {
      console.error("Error:", error);
    }
  });
```

#### **Error Code Handling Guidelines**

- **200 (Success)**: Proceed with displaying the data or showing a success message.
- **400 (Bad Request)**: Display an error message prompting the user to check their input or provide more details.
- **401 (Unauthorized)**: Prompt the user to log in or provide the correct authentication credentials.
- **403 (Forbidden)**: Inform the user that they do not have permission to access the resource.
- **404 (Not Found)**: Show a message that the requested resource is not available.
- **409 (Already Exists)**: Inform the user that the resource they are trying to create already exists (e.g., duplicate entry).
- **422 (Validation Error)**: Guide the user to fix specific validation issues like missing or incorrect data.
- **500 (Internal Server Error)**: Display a generic error message asking the user to try again later.

#### **Note:**

Ensure that the frontend handles these error codes consistently across different components and displays appropriate messages or prompts to the user.

---

### **Integration with Frontend: Transition Notes**

While the new error handling system introduces a more structured way of responding with error codes and messages, the change is **not drastic**. The frontend can still handle errors based on status codes and the provided `message`. Here's a summary of how the transition should be smooth:

1. **Structured Responses**: The backend will now send responses with a `statusCode`, `message`, and optionally `data`. Frontend logic will need to adjust to check for `statusCode` rather than directly reading error strings.
2. **Minimal Changes**: Frontend developers may need to adjust error handling to check `statusCode` (such as 404 for "Not Found" instead of a string match) but this is a **manageable update**. This ensures consistency and allows for better maintainability in the future.

By following this new structure, you can achieve better error reporting and easier debugging both in development and production environments.
