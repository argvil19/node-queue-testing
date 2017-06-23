var queueOptions = {
  concurrency: 3,
  timeout: 150000
}
var qHtml = require('queue')(queueOptions);
var qPdf = require('queue')(queueOptions)
var results = [];

qHtml.on('success', function() {
  if (!qHtml.length && !qPdf.running) {
    qPdf.start();
  }
});

qPdf.on('success', function() {
  if (qHtml.length) {
    qPdf.stop();
  }
})

module.exports = function(app, io) {

  function addToQueue(type) {
    var id = results.length;
    var item = {
      id: id,
      type: type,
      date: new Date(),
      name: type + ' ' + id,
      status: 0
    };

    app.io.emit('new_item', item);

    if (type === 'HTML') {
      qHtml.push(function(cb) {
        setTimeout(function() {
          var index = results.findIndex(function(i) {
            return i.id === item.id;
          });
          results[index].status = 1;
          cb();
          app.io.emit('item_finished', results[index]);
        }, 10000);
      });
    } else {
      qPdf.push(function(cb) {
        setTimeout(function() {
          var index = results.findIndex(function(i) {
            return i.id === item.id;
          });
          results[index].status = 1;
          cb();
          app.io.emit('item_finished', results[index]);
        }, 100000);
      });
    }

    results.push(item);
  }

  app.post('/html', function(req, res, next) {
    addToQueue('HTML');
    
    if (!qPdf.running) {
      qHtml.start();
    }

    return res.send({
      success: true
    });
  });

  app.post('/pdf', function(req, res, next) {
    addToQueue('PDF');
    
    if (!qHtml.running) {
      qPdf.start();
    }

    return res.send({
      success: true
    });
  });

  io.on('connection', function(socket) {
    socket.emit('get_queue', results);
  });
};
