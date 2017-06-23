### Queue system test

Playing with queues. Simulates a queue of PDF and HTML files that should be processed. HTML files has priority and take less time than the PDF ones.

* HTML files takes 10 seconds to process.
* PDF files takes 100 seconds to process.

Every time an item is added to the queue, a socket.io event called `new_item` fires. It holds info about the new item created.

Once an item is processed, a socket.io event called `item_finished` fires. It holds info about the item that has been processed.


#### Instructions

1. `npm install`
2. `npm start`

#### Endpoints

* `POST /html` creates a new HTML entry.
* `POST /pdf` creates a new PDF entry.