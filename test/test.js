'use strict';

var expect = require('chai').expect;
var EventEmitter = require('../');
var slice = Array.prototype.slice;

describe('events-light', function tests() {
    it('handle single listener', function() {
        var myEE = new EventEmitter();
        var fooA = null;
        var fooThis;

        myEE.on('foo', function() {
            fooA = slice.call(arguments);
            fooThis = this;
        });

        myEE.emit('foo', 'a', 'b');
        expect(fooA).to.deep.equal(['a', 'b']);
        expect(fooThis).to.equal(myEE);
        expect(myEE.listenerCount('foo')).to.equal(1);
    });

    it('handle multiple listener', function() {
        var myEE = new EventEmitter();
        var fooAEvents = [];
        var fooBEvents = [];

        myEE.on('foo', function() {
            fooAEvents.push(slice.call(arguments));
        });

        myEE.on('foo', function() {
            fooBEvents.push(slice.call(arguments));
        });

        myEE.emit('foo', 'a', 'b');

        expect(fooAEvents).to.deep.equal([['a', 'b']]);
        expect(fooBEvents).to.deep.equal([['a', 'b']]);

        expect(myEE.listenerCount('foo')).to.equal(2);
    });

    it('support once', function() {
        var myEE = new EventEmitter();
        var events = [];

        myEE.once('foo', function() {
            events.push(slice.call(arguments));
        });

        myEE.emit('foo', 'a', 'b');
        expect(events).to.deep.equal([['a', 'b']]);
        myEE.emit('foo', 'c', 'd');
        expect(events).to.deep.equal([['a', 'b']]);

    });

    it('handle remove single listener', function() {
        var myEE = new EventEmitter();

        var events = [];

        function fooA() {
            events.push(slice.call(arguments));
        }

        myEE.on('foo', fooA);

        myEE.emit('foo', 'a', 'b');
        expect(events).to.deep.equal([['a', 'b']]);

        myEE.removeListener('foo', fooA);
        myEE.emit('foo', 'a', 'b');
        expect(events).to.deep.equal([['a', 'b']]);
    });

    it('handle remove mutliple listener', function() {
        var myEE = new EventEmitter();

        var fooAEvents = [];
        var fooBEvents = [];

        function fooA() {
            fooAEvents.push(slice.call(arguments));
        }

        function fooB() {
            fooBEvents.push(slice.call(arguments));
        }

        myEE.on('foo', fooA);
        myEE.on('foo', fooB);

        expect(myEE.listenerCount('foo')).to.equal(2);

        myEE.emit('foo', 'a', 'b');
        expect(fooAEvents).to.deep.equal([['a', 'b']]);
        expect(fooBEvents).to.deep.equal([['a', 'b']]);

        myEE.removeListener('foo', fooA);
        expect(myEE.listenerCount('foo')).to.equal(1);
        myEE.emit('foo', 'c', 'd');
        expect(fooAEvents).to.deep.equal([['a', 'b']]);
        expect(fooBEvents).to.deep.equal([['a', 'b'], ['c', 'd']]);

        myEE.removeListener('foo', fooB);
        expect(myEE.listenerCount('foo')).to.equal(0);
        myEE.emit('foo', 'e', 'f');
        expect(fooAEvents).to.deep.equal([['a', 'b']]);
        expect(fooBEvents).to.deep.equal([['a', 'b'], ['c', 'd']]);
    });

    it('should handle removeAllListeners', function() {
        var myEE = new EventEmitter();

        var fooAEvents = [];
        var fooBEvents = [];

        myEE.on('foo', function fooA() {
            fooAEvents.push(slice.call(arguments));
        });
        myEE.on('foo', function fooB() {
            fooBEvents.push(slice.call(arguments));
        });

        expect(myEE.listenerCount('foo')).to.equal(2);

        myEE.emit('foo', 'a', 'b');
        expect(fooAEvents).to.deep.equal([['a', 'b']]);
        expect(fooBEvents).to.deep.equal([['a', 'b']]);

        myEE.removeAllListeners('foo');
        expect(myEE.listenerCount('foo')).to.equal(0);
        myEE.emit('foo', 'c', 'd');
        expect(fooAEvents).to.deep.equal([['a', 'b']]);
        expect(fooBEvents).to.deep.equal([['a', 'b']]);
    });

    it('inherits when used with `require("util").inherits`', function() {
        function MyEventEmitter() {
            EventEmitter.call(this);
        }

        require('util').inherits(MyEventEmitter, EventEmitter);

        var myEE = new MyEventEmitter();

        var fooCount = 0;

        myEE.on('foo', function() {
            fooCount++;
        });

        myEE.emit('foo');
        expect(fooCount).to.equal(1);

        myEE.emit('foo');
        expect(fooCount).to.equal(2);
    });

    it('support require("events-light").EventEmitter', function() {
        var EventEmitter = require('../').EventEmitter;

        var myEE = new EventEmitter();
        var fooA = null;

        myEE.on('foo', function() {
            fooA = slice.call(arguments);
        });

        myEE.emit('foo', 'a', 'b');
        expect(fooA).to.deep.equal(['a', 'b']);
        expect(myEE.listenerCount('foo')).to.equal(1);
    });
});