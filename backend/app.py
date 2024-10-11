from flask import Flask, request, jsonify

app = Flask(__name__)

nextIdx = 5
todos = [
    {
        "id": 1,
        "title": "Find a great team",
    },
    {
        "id": 2,
        "title": "Choose a project",
    },
    {
        "id": 3,
        "title": "Interview people for need-finding",
    },
    {
        "id": 4,
        "title": "Come up with a lo-fi prototype",
    },
]


@app.get("/api/todos")
def fetch_todos():
    global todos
    return todos

@app.post("/api/todos")
def create_todo():
    global todos, nextIdx
    content = request.json
    todos.append({"id": nextIdx, "title": content["title"]})
    nextIdx += 1
    return "OK"

@app.delete("/api/todos/<int:id>")
def delete_todo(id):
    global todos
    todos = [todo for todo in todos if todo["id"] != int(id)]
    return "OK"

if __name__ == "__main__":
    app.run(debug=True)
