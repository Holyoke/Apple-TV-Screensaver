FamousFramework.component('scruggy:apple-tv', {
  behaviors: {
    '#root':{
      'style':{
        'perspective':'1000px'
      }
    },
    '#rotator-node': {
      'size': function(contextSize){
        return [contextSize, contextSize];
      },
      'align': [0.5, 0.5],
      'mount-point': [0.5, 0.5],
      'origin': [0.5, 0.5],
      'style': {
      },
      'rotation': function(rotationValue){
        return [-Math.PI/2, 0, rotationValue];
      },
    },
    '.gallery-item':{
      'size': [100, 100],
      'content': function($index, srcs) {
        return `<img src="${ srcs[$index] }" style="height:100px;width:100px"/>`
      },
      'style': {
        'background-color': 'blue',
        'border': '2px solid black'
      },
      '$repeat':function(srcs) {
        return srcs;
      },
      'position-x': function($index, contextSize) {
        return Math.random() * contextSize;
      },
      'position-y': function($index, contextSize) {
        return Math.random() * contextSize;
      },
      'position-z': function($index, positionZ) {
        return positionZ[$index];
      },
      '#rotator-node': {
        'position-z': function(rootZ) {
          return rootZ;
        }
      },
      'rotation': [Math.PI / 2, 0 ,0]
    }
  },
  events: {
    '$lifecycle': {
      'post-load': function($state, $famousNode) {
        //add a compmonent with an `onUpdate` method
        var id = $famousNode.addComponent({
          onUpdate: function(time) {
            //go through all the 'positionZ' values
            for(var i = 0; i < $state.get('srcs').length; i++) {
              //get current values
              var currentZ = $state.get(['positionZ', i]);

              //if image is out of screen move it back to bottom
              if(currentZ < -$state.get('contextSize')) {
                currentZ = $state.get('contextSize')+100;
              }

              //set new decremented value
              $state.set(['positionZ', i], currentZ-1);
            }
            //add self to the update queue and create loop
            $famousNode.requestUpdateOnNextTick(id);
          }
        });
        //start the loop
        $famousNode.requestUpdateOnNextTick(id);
      },
      //this is a selector
    },
    '.gallery-item': {
      'click': function($state) {
        $state.set('rotationValue', $state.get('rotationValue') - Math.PI/2, {
                      duration: 1000,
                      curve: 'easeIn'
        })
        .thenSet('rotationValue', $state.get('rotationValue') - (Math.PI*2), {
                      duration: 2000,
                      curve: 'easeOut'
        });

        //emphasis
        $state.set('rootZ', -250, {
          duration: 1000,
          curve: 'easeOut'
        })
        .thenSet('rootZ', 0, {
          duration: 200,
          curve: 'easeInOut'
        });
      }
    }
  },
  states: {
    rotationValue: 0,
    srcs: imageData,
    contextSize: contextSize,
    positionZ: randomCoordinates(imageData),
    rootZ: 0
  },
  tree: 'apple-tv.html'
}).config({
  includes: [
    'galleryData.js',
    'apple-tv.css'
  ]
})
