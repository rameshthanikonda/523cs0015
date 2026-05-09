# Notification System Design

# Stage 1

## Base URL

/api/v1

# Get All Notifications
GET /notifications
## Response

json
{
  "notifications": [
    {
      "id": "123",
      "type": "Placement",
      "message": "TCS Hiring Drive",
      "timestamp": "2026-04-22T17:51:30Z",
      "isRead": false
    }
  ]
}


Get Unread Notifications
GET/notifications/unread

Response
{
  "count": 5,
  "notifications": []
}
Create Notification
POST/notifications

Request
{
  "type": "Placement",
  "message": "Microsoft Hiring"
}
Mark Notification As Read
PUT/notifications/:id/read

Delete Notification
DELETE/notifications/:id
Headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer token"
}
Real Time Notification

I will use websocket or socket.io because it gives instant notification to users without refreshing page.

Stage 2
Database

I will use mysql database because it is reliable and scalable.

Tables
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  studentId INT,
  type VARCHAR(20),
  message TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Problems At Large Scale
database load increases
queries become slow
response time increases
Solution
indexing
pagination
caching
websocket
lazy loading
Query Example
SELECT * FROM notifications
WHERE studentId = 101
AND isRead = false;
Stage 3
Slow Query
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
Why Slow

This query can become slow because full table scan may happen.

Better Solution
CREATE INDEX idx_notifications
ON notifications(studentID, isRead, createdAt DESC);
Why Not Add Indexes Everywhere

Adding indexes everywhere increases storage and slows inserts and updates.

Placement Query
SELECT DISTINCT studentID
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
Stage 4
Redis Cache
Redis cache reduces database load and gives faster response.
GET/notifications?page=1&limit=10
This reduces heavy data loading.
Lazy Loading
Notifications loaded only when user opens notification panel.
WebSockets
WebSockets provide real time notifications.

Stage 5
Problems In Existing Code
sequential execution slow
email sending slow
no retry mechanism
no queue system
Better Architecture

I will use:
queue system
async workers
retry mechanism
background jobs
Pseudocode
function notify_all(student_ids, message):
    save_notifications_to_db(student_ids, message)
    publish_to_queue(student_ids, message)
worker_process():

    while queue_not_empty:
        task = get_task()
        try:
            send_email(task.student_id, task.message)
            push_to_app(task.student_id, task.message)
        except:
            retry(task)
Stage 6
Priority Inbox
Priority Order:
Placement
Result
Event
Priority Logic
Placement=3
Result=2
Event=1
JavaScript Example
const priorityMap={
  Placement:3,
  Result:2,
  Event:1
};

notifications.sort((a, b) => {

  if (priorityMap[b.type] !== priorityMap[a.type]) {
    return priorityMap[b.type] - priorityMap[a.type];
  }

  return new Date(b.timestamp) - new Date(a.timestamp);
});
Efficient Solution

I will use min heap or priority queue for efficient top notification handling.