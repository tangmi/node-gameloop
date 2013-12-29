node-game-loop
==============

A game loop in node.js capable of accurate frame rates. 

This is an alternative to setTimeout/setInterval loops which are accurate to within 16 ms.

This is also an alternative to a pure setImmediate loop which is nice and accurate, but will use 100% CPU (well, 100% of one thread) even while idle.

