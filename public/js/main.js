(function(window, document) {

  const Fabric = {
    create: function(type, params) {
      var element = document.createElement(type);

      for (var key in params) {
        element[key] = params[key]
      }

      return element;
    }
  }

  const Application = function(id) {
    this.el = document.getElementById(id);
    this.tests = [];
  };

  Application.prototype.recordValue = function(result) {
    var info = Fabric.create('div', {
        className: 'TestInfo'
    });
    var time = Fabric.create('div', {
      className: 'TestInfoTime',
      innerHTML: `Time: ${result.time}ms`
    });
    var iteration = Fabric.create('div', {
      className: 'TestInfoIteration',
      innerHTML: `Iteration: ${result.iteration}`
    });

    info.appendChild(time);
    info.appendChild(iteration);

    document.getElementById(result.id).appendChild(info);
  }

  Application.prototype.countTime = function(test) {
    var startTime = new Date().getTime();

    for (var i = 0, max = test.iteration || 1; i<max; i++) {
      test.func(i);
    }

    var endTime = new Date().getTime();

    var delay = endTime - startTime;
    var params = {
      time: delay,
      iteration: test.iteration,
      id: test.id
    };

    this.recordValue(params);

    return params;
  };

  Application.prototype.createContainer = function(test) {

    var container = Fabric.create('div', {
      id: test.id,
      className: 'Test'
    });

    var title = Fabric.create('div', {
      className: 'TestTitle',
      innerHTML: test.title || 'Test'
    });

    var scriptText = Fabric.create('div', {
      className: 'TestScript'
    });

    var removeBtn = Fabric.create('div', {
      className: 'TestRemove'
    });

    removeBtn.setAttribute('data-victim', test.id);

    scriptText.appendChild(this.makeCode(test.func || test.funcString));

    removeBtn.addEventListener('click', function() {
      if (confirm('Are you sure ?')) {
        var stash = JSON.parse(localStorage.getItem('jsTestFunction'));
        var victim = this.getAttribute('data-victim');
        var index = 0;

        for (var i = 0, max = stash.length; i<max; i++) {
          (function(i, obj) {
            if (obj.id === victim) {
              index = i;
            }
          })(i, stash[i])
        };

        stash.splice(index, 1);
        localStorage.setItem('jsTestFunction', JSON.stringify(stash));

        document.getElementById(victim).remove();

      }
    })

    container.appendChild(title);
    container.appendChild(scriptText);
    container.appendChild(removeBtn)

    this.el.appendChild(container);
  }

  Application.prototype.makeCode = function(func) {
    var functionInString = [] + func;
    var fragment = document.createDocumentFragment();

    var pattern = /[{;}]/g;
    var bracket = functionInString.match(pattern)
    var parts = functionInString.split(pattern);
    var level = 1;

    for (var i = 0, max = (parts.length < 2 ? parts.length : parts.length-1); i < max; i++) {
      fragment.appendChild(Fabric.create('div', {
        className: `Code Code--Level-${level}`,
        innerHTML: `${parts[i]}${bracket ? bracket[i] : ''}`
      }))

      if (bracket) {
        switch (bracket[i]) {
          case '{':
            level++;
            break;
          case '}':
            level--;
            break
          default:
            break;
        }
      }
    }

    return fragment;
  }

  Application.prototype.createCanvas = function() {
      var canvasWrap = Fabric.create('div', {
        className: 'ScriptCanvas--Wrap'
      });

      var canvas = Fabric.create('textarea', {
        id: 'canvas',
        className: 'ScriptCanvas'
      });

      var iterCounter = Fabric.create('input', {
        type: 'text',
        id: 'canvas_iteration',
        className: 'ScriptCanvasIter',
        placeholder: 'Add iteration count'
      });

      var title = Fabric.create('input', {
        type: 'text',
        id: 'canvas_title',
        className: 'ScriptCanvasTitle',
        placeholder: 'Add test title'
      });

      var button = Fabric.create('div', {
          id: 'canvas_btn',
          className: 'ScriptCanvasButton'
      });

      var errorContainer = Fabric.create('div', {
        id: 'canvas_error',
        className: 'ScriptCanvasError'
      });

      button.appendChild(errorContainer);

      canvas.addEventListener('keydown', function(e) {
        if (e.keyCode === 9) {
          e.preventDefault();
          e.stopPropagation();
          //console.log(e);
          //e.target.innerHTML = e.target.innerHTML + '\t';
        }
      })

      button.addEventListener('click', function() {
          if (canvas.value.length === 0) {
            this.triggerError("Need add code");
            return false;
          } else if(title.value.length === 0) {
            this.triggerError("Need add title");
            return false;
          }
          try {
              this.createTest({
                  title: title.value,
                  iteration: iterCounter.value,
                  funcString: canvas.value,
                  func: new Function(
                      `return function test(){${canvas.value}}`
                  )()
              });
          } catch(err) {
              this.triggerError("I can't parse function ")
          }
      }.bind(this));

      canvasWrap.appendChild(canvas);
      canvasWrap.appendChild(iterCounter);
      canvasWrap.appendChild(title);
      canvasWrap.appendChild(button);

      this.el.insertBefore(canvasWrap, this.el.children[0]);
  };

  Application.prototype.triggerError = function(msg) {
    var errorContainer = document.getElementById('canvas_error');

    errorContainer.innerHTML = msg;

    setTimeout(function() {
      errorContainer.innerHTML = null
    }, 2000)
  };

  Application.prototype.createTest = function(test) {
    this.tests.push(test);

    Object.defineProperty(test, 'id', {
      writable: false,
      value: `app_${this.tests.length}`
    });

    this.createContainer(test);

    var result = this.countTime(test);

    result.funcString = test.funcString;

    var stashedTests = JSON.parse(localStorage.getItem('jsTestFunction')) || [];

    stashedTests.push(result);

    localStorage.setItem('jsTestFunction', JSON.stringify(stashedTests));
  };

  const app = new Application('app');

  app.createCanvas();


  var stashedTests = localStorage.getItem('jsTestFunction');

  // If have stash in localStorage, paint tests cards

  if (stashedTests) {
    var arrOfTests = JSON.parse(stashedTests);

    for (var i = 0, max = arrOfTests.length; i < max; i++) {
      app.tests.push(arrOfTests[i]);
      app.createContainer(arrOfTests[i]);
      app.recordValue(arrOfTests[i]);
    }
  }
})(window, document)

