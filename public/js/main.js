(function(window, document) {


  const Fabric = {
    makeElement: function(type) {
        return document.createElement(type)
    },
    div: function(params) {
      var div = this.makeElement('div');

      for (var key in params) {
        div[key] = params[key]
      }

      return div
    },
    code: function(params) {
      var code = this.makeElement('code');

      for (var key in params) {
        code[key] = params[key]
      }

      return code
    }
  }

  const Application = function(id) {
    this.el = document.getElementById(id);
    this.tests = [];
  };

  Application.prototype.recordValue = function(result) {
    var info = Fabric.div({
        className: 'TestInfo'
    });
    var time = Fabric.div({
      className: 'TestInfoTime',
      innerHTML: `Time: ${result.time}ms`
    });
    var iteration = Fabric.div({
      className: 'TestInfoIteration',
      innerHTML: `Iteration: ${result.iteration}`
    });

    info.appendChild(time);
    info.appendChild(iteration);

console.log(result.id)
    document.getElementById(result.id).appendChild(info);
  }

  Application.prototype.countTime = function(test) {
    const startTime = new Date().getTime();

    for (var i = 0, max = test.iteration || 1; i<max; i++) {
      test.func(i);
    }

    const endTime = new Date().getTime();
    this.recordValue({
      time: endTime - startTime,
      iteration: test.iteration,
      id: test.id
    });
  };

  Application.prototype.createContainer = function(test) {

    const container = Fabric.div({
      id: test.id,
      className: 'Test'
    });
    const title = Fabric.div({
      className: 'TestTitle',
      innerHTML: test.title
    });

    const scriptText = Fabric.div({
      className: 'TestScript'
    });

    scriptText.appendChild(this.makeCode(test.func));

    container.appendChild(title)
    container.appendChild(scriptText)

    this.el.appendChild(container);
  }

  Application.prototype.makeCode = function(func) {
    var functionInString = [] + func;
    var fragment = document.createDocumentFragment();

    var pattern = /[{;}]/g;
    var bracket = functionInString.match(pattern)
    var parts = functionInString.split(pattern);
    var level = 1;

    for (var i = 0, max = parts.length; i < max; i++) {
      fragment.appendChild(Fabric.div({
        className: `Code Code--Level-${level}`,
        innerHTML: `${parts[i]}${bracket[i]}`
      }))

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

    return fragment;
  }

  Application.prototype.createTest = function(test) {
    this.tests.push(test);

    Object.defineProperty(test, 'id', {
      writable: false,
      value: `app_${this.tests.length}`
    });

    this.createContainer(test);
    this.countTime(test);
  };

  const app = new Application('app');

  app.createTest({
    title: 'Test on defineProperty',
    iteration: 100000,
    func: function(i) {

        var arr = [];

        var getRandomInt = function(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var distinct = function(arr) {
            var tempArr = [];

            for (var i = 0, max=arr.length; i < max; i++) {
              if (!tempArr.length) {
                tempArr.push(arr[i])
              } else {
                for (var k = 0, max = tempArr.length; k < max; k++) {
                  if (arr[i] === tempArr[k]) {
                      continue;
                  }

                  tempArr.push(arr[i])

                }
              }
            }

            return tempArr;
        };

        for (var i=0; i<20; i++) {
          arr.push(getRandomInt(1,5))
        };

        distinct(arr);
    }
  });

})(window, document)
