# Task Tracker CLI

A simple command line application for managing tasks.

## Requirements

- Node.js

## Usage

Add a task:

```bash
node app.js add "Buy groceries"
```

Update a task:

```bash
node app.js update 1 "Buy groceries and cook dinner"
```

Delete a task:

```bash
node app.js delete 1
```

Mark task as in progress:

```bash
node app.js mark-in-progress 1
```

Mark task as done:

```bash
node app.js mark-done 1
```

List all tasks:

```bash
node app.js list
```

List tasks by status:

```bash
node app.js list todo
node app.js list in-progress
node app.js list done
```

