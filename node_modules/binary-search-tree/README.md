# Binary search trees for Node.js

Two implementations of binary search tree: <a href="http://en.wikipedia.org/wiki/Binary_search_tree" target="_blank">basic</a> and <a href="http://en.wikipedia.org/wiki/AVL_tree" target="_blank">AVL</a> (a kind of self-balancing binmary search tree). I wrote this module primarily to store indexes for <a href="https://github.com/louischatriot/nedb" target="_blank">NeDB</a> (a javascript dependency-less database).


## Installation and tests
Package name is `binary-search-tree`.

```bash
npm install binary-search-tree --save

make test
```

## Usage
The API mainly provides 3 functions: `insert`, `search` and `delete`. If you do not create a unique-type binary search tree, you can store multiple pieces of data for the same key. Doing so with a unique-type BST will result in an error being thrown. Data is always returned as an array, and you can delete all data relating to a given key, or just one piece of data.

```javascript
var BinarySearchTree = require('binary-search-tree').BinarySearchTree
  , AVLTree = require('binary-search-tree').AVLTree   // Same API as BinarySearchTree

// Creating a binary search tree
var bst = new BinarySearchTree();

// Inserting some data
bst.insert(15, 'some data for key 15');
bst.insert(12, 'something else');
bst.insert(18, 'hello');

// You can insert multiple pieces of data for the same key
// if your tree doesn't enforce a unique constraint
bst.insert(18, 'world');

// Retrieving data (always returned as an array of all data stored for this key)
bst.search(15);   // Equal to ['some data for key 15']
bst.search(18);   // Equal to ['hello', 'world']
bst.search(1);    // Equal to []

// Search between bounds with a MongoDB-like query
// Data is returned in key order
// Note the difference between $lt (less than) and $gte (less than OR EQUAL)
bst.betweenBounds({ $lt: 18, $gte: 12});   // Equal to ['something else', 'some data for key 15']

// Deleting all the data relating to a key
bst.delete(15);   // bst.search(15) will now give []
bst.delete(18, 'world');   // bst.search(18) will now give ['hello']
```

There are three optional parameters you can pass the BST constructor, allowing you to enforce a key-uniqueness constraint, use a custom function to compare keys and use a custom function to check whether values are equal. These parameters are all passed in an object.

### Uniqueness

```javascript
var bst = new BinarySearchTree({ unique: true });
bst.insert(10, 'hello');
bst.insert(10, 'world');   // Will throw an error
```

### Custom key comparison

```javascript
// Custom key comparison function
// It needs to return a negative number if a is less than b,
// a positive number if a is greater than b
// and 0 if they are equal
// If none is provided, the default one can compare numbers, dates and strings
// which are the most common usecases
function compareKeys (a, b) {
  if (a.age < b.age) { return -1; }
  if (a.age > b.age) { return 1; }
  
  return 0;
}

// Now we can use objects with an 'age' property as keys
var bst = new BinarySearchTree({ compareKeys: compareKeys });
bst.insert({ age: 23 }, 'Mark');
bst.insert({ age: 47 }, 'Franck');
```

### Custom value checking

```javascript
// Custom value equality checking function used when we try to just delete one piece of data
// Returns true if a and b are considered the same, false otherwise
// The default function is able to compare numbers and strings
function checkValueEquality (a, b) {
  return a.length === b.length;
}
var bst = new BinarySearchTree({ checkValueEquality: checkValueEquality });
bst.insert(10, 'hello');
bst.insert(10, 'world');
bst.insert(10, 'howdoyoudo');

bst.delete(10, 'abcde');
bst.search(10);   // Returns ['howdoyoudo']
```


## License 

(The MIT License)

Copyright (c) 2013 Louis Chatriot &lt;louis.chatriot@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
