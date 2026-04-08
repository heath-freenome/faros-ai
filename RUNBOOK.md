# Triaging issues

This is a guide for using telemetry to debug issues with the application.

## What to check

1. Is the feature enabled for the user? Have they consented?
   - Checking the `page.load` events will indicate if the feature flag is enable along with the consent status
   - Checking the `consent.optOut` events will indicate if the user opted out of using the feature
2. Where there any issues with loading the employees? Or filtering the employee list?
   - Checking the `api.employees.error` and/or `api.filterOptions.error` events will indicate why the APIs failed 
3. Is the loading or filtering of employees slow?
   - Checking the `api.employees.success` and/or `api.filterOptions.success` events will indicate the duration of any successful event
   - Look for slow calls and correlate that with the DB and API logs to see if anything is occurring on the server
4. Did the AI Insights stop working? Was there an issue with loading the AI Insights?
   - Checking the `api.insights.error` events will indicate why the API failed
   - Checking the timestamp of the failure against the `page.load`'s `aiConsentExpiry` to see if the consent timed out before calling the API
5. Is the loading of the AI Insights slow?
    - Checking the `api.insights.success` events will indicate the duration of any successful event
    - Look for slow calls and correlate that with the DB and API logs to see if anything is occurring on the server
6. Did granting AI Consent fail?
    - Checking the `api.consent.error` events will indicate why the API failed
7. Is the granting of AI Consent slow?
    - Checking the `api.consent.success` events will indicate the duration of any successful event
    - Look for slow calls and correlate that with the DB and API logs to see if anything is occurring on the server

## Telemetry

Here is an overview of the telemetry information that is known to be logged for the application:

| Event                       | Source                    | Trigger                                               | context                   | details                                                         | stackTrace    | Request fields                                                     |
|-----------------------------|---------------------------|-------------------------------------------------------|---------------------------|-----------------------------------------------------------------|---------------|--------------------------------------------------------------------|
| `page.load`                 | `PageLoadTelemetry`       | Once on initial mount                                 | `App`                     | `{ flags, aiConsentGranted, aiConsentActive, aiConsentExpiry }` | —             | —                                                                  |
| `error.boundary`            | `ErrorBoundary`           | Unhandled render error caught by React error boundary | React component stack     | `error.message`                                                 | `error.stack` | —                                                                  |
| `api.employees.success`     | `useEmployees`            | GraphQL employee page fetched successfully            | `useEmployees`            | `{ page, pageSize, afterCursor, search, filter }`               | —             | `requestStart`, `requestDuration`, `requestStatus: 200`            |
| `api.employees.error`       | `useEmployees`            | GraphQL fetch or server error                         | `useEmployees`            | `{ page, pageSize, afterCursor, search, filter }`               | —             | `requestStart`, `requestDuration`, `requestError`                  |
| `api.filterOptions.success` | `useFilterOptions`        | Filter options fetched successfully                   | `useFilterOptions`        | `{ teams, trackingStatuses, accountTypes }` (counts)            | —             | `requestStart`, `requestDuration`, `requestStatus`                 |
| `api.filterOptions.error`   | `useFilterOptions`        | Filter options fetch failed                           | `useFilterOptions`        | `{ query: 'FILTER_OPTIONS_QUERY' }`                             | —             | `requestStart`, `requestDuration`, `requestStatus`, `requestError` |
| `api.insights.success`      | `useEmployeeInsights`     | AI insights fetched successfully                      | `useEmployeeInsights`     | `{ employeeId, model, processingTimeMs }`                       | —             | `requestStart`, `requestDuration`, `requestStatus`                 |
| `api.insights.error`        | `useEmployeeInsights`     | AI insights fetch failed                              | `useEmployeeInsights`     | `{ employeeId }`                                                | —             | `requestStart`, `requestDuration`, `requestStatus`, `requestError` |
| `api.consent.success`       | `AiInsightsConsentDialog` | User granted consent and API returned a token         | `AiInsightsConsentDialog` | `{ scope, expiresAt }`                                          | —             | `requestStart`, `requestDuration`, `requestStatus`                 |
| `api.consent.error`         | `AiInsightsConsentDialog` | Consent API call failed                               | `AiInsightsConsentDialog` | `{ scope }`                                                     | —             | `requestStart`, `requestDuration`, `requestStatus`, `requestError` |
| `consent.optOut`            | `AiInsightsConsentDialog` | User clicked No to decline consent                    | `AiInsightsConsentDialog` | —                                                               | —             | —                                                                  |
| `employee.viewed`           | `EmployeeDetailPanel`     | Panel opens or the viewed employee changes            | `EmployeeDetailPanel`     | `{ employeeId, employeeUid, trackingStatus, trackingCategory }` | —             | —                                                                  |

### Field reference

| Field             | Type      | Description                                                                      |
|-------------------|-----------|----------------------------------------------------------------------------------|
| `sessionId`       | `string`  | UUID generated once per browser tab                                              |
| `userId`          | `string`  | SHA-256 hex digest of the raw user identifier — never transmitted in plain text  |
| `event`           | `string`  | Dot-namespaced event name, e.g. `api.employees.success`                          |
| `context`         | `string`  | Where the event originated — hook name, component name, or React component stack |
| `details`         | `string?` | JSON-serialised payload describing the request parameters or response summary    |
| `stackTrace`      | `string?` | `Error.stack` string, present only for `error.boundary` events                   |
| `requestStart`    | `string?` | ISO-8601 timestamp at which the HTTP request was initiated                       |
| `requestDuration` | `number?` | Elapsed milliseconds from request start to response received                     |
| `requestStatus`   | `number?` | HTTP status code of the response                                                 |
| `requestError`    | `string?` | Human-readable error message when the request failed                             |
