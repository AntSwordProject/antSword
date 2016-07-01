var should = require('chai').should()
  , assert = require('chai').assert
  , BinarySearchTree = require('../index').BinarySearchTree
  , _ = require('underscore')
  , customUtils = require('../lib/customUtils')
  ;


describe('Binary search tree', function () {

  it('Upon creation, left, right are null, key and data can be set', function () {
    var bst = new BinarySearchTree();
    assert.isNull(bst.left);
    assert.isNull(bst.right);
    bst.hasOwnProperty('key').should.equal(false);
    bst.data.length.should.equal(0);

    bst = new BinarySearchTree({ key: 6, value: 'ggg' });
    assert.isNull(bst.left);
    assert.isNull(bst.right);
    bst.key.should.equal(6);
    bst.data.length.should.equal(1);
    bst.data[0].should.equal('ggg');
  });

  describe('Sanity checks', function () {

    it('Can get maxkey and minkey descendants', function () {
      var t = new BinarySearchTree({ key: 10 })
        , l = new BinarySearchTree({ key: 5 })
        , r = new BinarySearchTree({ key: 15 })
        , ll = new BinarySearchTree({ key: 3 })
        , lr = new BinarySearchTree({ key: 8 })
        , rl = new BinarySearchTree({ key: 11 })
        , rr = new BinarySearchTree({ key: 42 })
        ;

      t.left = l; t.right = r;
      l.left = ll; l.right = lr;
      r.left = rl; r.right = rr;

      // Getting min and max key descendants
      t.getMinKeyDescendant().key.should.equal(3);
      t.getMaxKeyDescendant().key.should.equal(42);

      t.left.getMinKeyDescendant().key.should.equal(3);
      t.left.getMaxKeyDescendant().key.should.equal(8);

      t.right.getMinKeyDescendant().key.should.equal(11);
      t.right.getMaxKeyDescendant().key.should.equal(42);

      t.right.left.getMinKeyDescendant().key.should.equal(11);
      t.right.left.getMaxKeyDescendant().key.should.equal(11);

      // Getting min and max keys
      t.getMinKey().should.equal(3);
      t.getMaxKey().should.equal(42);

      t.left.getMinKey().should.equal(3);
      t.left.getMaxKey().should.equal(8);

      t.right.getMinKey().should.equal(11);
      t.right.getMaxKey().should.equal(42);

      t.right.left.getMinKey().should.equal(11);
      t.right.left.getMaxKey().should.equal(11);
    });

    it('Can check a condition against every node in a tree', function () {
      var t = new BinarySearchTree({ key: 10 })
        , l = new BinarySearchTree({ key: 6 })
        , r = new BinarySearchTree({ key: 16 })
        , ll = new BinarySearchTree({ key: 4 })
        , lr = new BinarySearchTree({ key: 8 })
        , rl = new BinarySearchTree({ key: 12 })
        , rr = new BinarySearchTree({ key: 42 })
        ;

      t.left = l; t.right = r;
      l.left = ll; l.right = lr;
      r.left = rl; r.right = rr;

      function test (k, v) { if (k % 2 !== 0) { throw 'Key is not even'; } }

      t.checkAllNodesFullfillCondition(test);

      [l, r, ll, lr, rl, rr].forEach(function (node) {
        node.key += 1;
        (function () { t.checkAllNodesFullfillCondition(test); }).should.throw();
        node.key -= 1;
      });

      t.checkAllNodesFullfillCondition(test);
    });

    it('Can check that a tree verifies node ordering', function () {
      var t = new BinarySearchTree({ key: 10 })
        , l = new BinarySearchTree({ key: 5 })
        , r = new BinarySearchTree({ key: 15 })
        , ll = new BinarySearchTree({ key: 3 })
        , lr = new BinarySearchTree({ key: 8 })
        , rl = new BinarySearchTree({ key: 11 })
        , rr = new BinarySearchTree({ key: 42 })
        ;

      t.left = l; t.right = r;
      l.left = ll; l.right = lr;
      r.left = rl; r.right = rr;

      t.checkNodeOrdering();

      // Let's be paranoid and check all cases...
      l.key = 12;
      (function () { t.checkNodeOrdering(); }).should.throw();
      l.key = 5;

      r.key = 9;
      (function () { t.checkNodeOrdering(); }).should.throw();
      r.key = 15;

      ll.key = 6;
      (function () { t.checkNodeOrdering(); }).should.throw();
      ll.key = 11;
      (function () { t.checkNodeOrdering(); }).should.throw();
      ll.key = 3;

      lr.key = 4;
      (function () { t.checkNodeOrdering(); }).should.throw();
      lr.key = 11;
      (function () { t.checkNodeOrdering(); }).should.throw();
      lr.key = 8;

      rl.key = 16;
      (function () { t.checkNodeOrdering(); }).should.throw();
      rl.key = 9;
      (function () { t.checkNodeOrdering(); }).should.throw();
      rl.key = 11;

      rr.key = 12;
      (function () { t.checkNodeOrdering(); }).should.throw();
      rr.key = 7;
      (function () { t.checkNodeOrdering(); }).should.throw();
      rr.key = 10.5;
      (function () { t.checkNodeOrdering(); }).should.throw();
      rr.key = 42;

      t.checkNodeOrdering();
    });

    it('Checking if a tree\'s internal pointers (i.e. parents) are correct', function () {
      var t = new BinarySearchTree({ key: 10 })
        , l = new BinarySearchTree({ key: 5 })
        , r = new BinarySearchTree({ key: 15 })
        , ll = new BinarySearchTree({ key: 3 })
        , lr = new BinarySearchTree({ key: 8 })
        , rl = new BinarySearchTree({ key: 11 })
        , rr = new BinarySearchTree({ key: 42 })
        ;

      t.left = l; t.right = r;
      l.left = ll; l.right = lr;
      r.left = rl; r.right = rr;

      (function () { t.checkInternalPointers(); }).should.throw();
      l.parent = t;
      (function () { t.checkInternalPointers(); }).should.throw();
      r.parent = t;
      (function () { t.checkInternalPointers(); }).should.throw();
      ll.parent = l;
      (function () { t.checkInternalPointers(); }).should.throw();
      lr.parent = l;
      (function () { t.checkInternalPointers(); }).should.throw();
      rl.parent = r;
      (function () { t.checkInternalPointers(); }).should.throw();
      rr.parent = r;

      t.checkInternalPointers();
    });

    it('Can get the number of inserted keys', function () {
      var bst = new BinarySearchTree();

      bst.getNumberOfKeys().should.equal(0);
      bst.insert(10);
      bst.getNumberOfKeys().should.equal(1);
      bst.insert(5);
      bst.getNumberOfKeys().should.equal(2);
      bst.insert(3);
      bst.getNumberOfKeys().should.equal(3);
      bst.insert(8);
      bst.getNumberOfKeys().should.equal(4);
      bst.insert(15);
      bst.getNumberOfKeys().should.equal(5);
      bst.insert(12);
      bst.getNumberOfKeys().should.equal(6);
      bst.insert(37);
      bst.getNumberOfKeys().should.equal(7);
    });

  });

  describe('Insertion', function () {

    it('Insert at the root if its the first insertion', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');

      bst.checkIsBST();
      bst.key.should.equal(10);
      _.isEqual(bst.data, ['some data']).should.equal(true);
      assert.isNull(bst.left);
      assert.isNull(bst.right);
    });

    it("Insert on the left if key is less than the root's", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(7, 'some other data');

      bst.checkIsBST();
      assert.isNull(bst.right);
      bst.left.key.should.equal(7);
      _.isEqual(bst.left.data, ['some other data']).should.equal(true);
      assert.isNull(bst.left.left);
      assert.isNull(bst.left.right);
    });

    it("Insert on the right if key is greater than the root's", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(14, 'some other data');

      bst.checkIsBST();
      assert.isNull(bst.left);
      bst.right.key.should.equal(14);
      _.isEqual(bst.right.data, ['some other data']).should.equal(true);
      assert.isNull(bst.right.left);
      assert.isNull(bst.right.right);
    });

    it("Recursive insertion on the left works", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(7, 'some other data');
      bst.insert(1, 'hello');
      bst.insert(9, 'world');

      bst.checkIsBST();
      assert.isNull(bst.right);
      bst.left.key.should.equal(7);
      _.isEqual(bst.left.data, ['some other data']).should.equal(true);

      bst.left.left.key.should.equal(1);
      _.isEqual(bst.left.left.data, ['hello']).should.equal(true);

      bst.left.right.key.should.equal(9);
      _.isEqual(bst.left.right.data, ['world']).should.equal(true);
    });

    it("Recursive insertion on the right works", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(17, 'some other data');
      bst.insert(11, 'hello');
      bst.insert(19, 'world');

      bst.checkIsBST();
      assert.isNull(bst.left);
      bst.right.key.should.equal(17);
      _.isEqual(bst.right.data, ['some other data']).should.equal(true);

      bst.right.left.key.should.equal(11);
      _.isEqual(bst.right.left.data, ['hello']).should.equal(true);

      bst.right.right.key.should.equal(19);
      _.isEqual(bst.right.right.data, ['world']).should.equal(true);
    });

    it('If uniqueness constraint not enforced, we can insert different data for same key', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(3, 'hello');
      bst.insert(3, 'world');

      bst.checkIsBST();
      bst.left.key.should.equal(3);
      _.isEqual(bst.left.data, ['hello', 'world']).should.equal(true);

      bst.insert(12, 'a');
      bst.insert(12, 'b');

      bst.checkIsBST();
      bst.right.key.should.equal(12);
      _.isEqual(bst.right.data, ['a', 'b']).should.equal(true);
    });

    it('If uniqueness constraint is enforced, we cannot insert different data for same key', function () {
      var bst = new BinarySearchTree({ unique: true });

      bst.insert(10, 'some data');
      bst.insert(3, 'hello');
      try {
        bst.insert(3, 'world');
      } catch (e) {
        e.errorType.should.equal('uniqueViolated');
        e.key.should.equal(3);
      }

      bst.checkIsBST();
      bst.left.key.should.equal(3);
      _.isEqual(bst.left.data, ['hello']).should.equal(true);

      bst.insert(12, 'a');
      try {
        bst.insert(12, 'world');
      } catch (e) {
        e.errorType.should.equal('uniqueViolated');
        e.key.should.equal(12);
      }

      bst.checkIsBST();
      bst.right.key.should.equal(12);
      _.isEqual(bst.right.data, ['a']).should.equal(true);
    });

    it('Can insert 0 or the empty string', function () {
      var bst = new BinarySearchTree();

      bst.insert(0, 'some data');

      bst.checkIsBST();
      bst.key.should.equal(0);
      _.isEqual(bst.data, ['some data']).should.equal(true);
      assert.isNull(bst.left);
      assert.isNull(bst.right);

      bst = new BinarySearchTree();

      bst.insert('', 'some other data');

      bst.checkIsBST();
      bst.key.should.equal('');
      _.isEqual(bst.data, ['some other data']).should.equal(true);
      assert.isNull(bst.left);
      assert.isNull(bst.right);
    });

    it('Can insert a lot of keys and still get a BST (sanity check)', function () {
      var bst = new BinarySearchTree({ unique: true });

      customUtils.getRandomArray(100).forEach(function (n) {
        bst.insert(n, 'some data');
      });

      bst.checkIsBST();
    });

    it('All children get a pointer to their parent, the root doesnt', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'root');
      bst.insert(5, 'yes');
      bst.insert(15, 'no');

      bst.checkIsBST();

      assert.isNull(bst.parent);
      bst.left.parent.should.equal(bst);
      bst.right.parent.should.equal(bst);
    });

  });   // ==== End of 'Insertion' ==== //


  describe('Search', function () {

    it('Can find data in a BST', function () {
      var bst = new BinarySearchTree()
        , i;

      customUtils.getRandomArray(100).forEach(function (n) {
        bst.insert(n, 'some data for ' + n);
      });

      bst.checkIsBST();

      for (i = 0; i < 100; i += 1) {
        _.isEqual(bst.search(i), ['some data for ' + i]).should.equal(true);
      }
    });

    it('If no data can be found, return an empty array', function () {
      var bst = new BinarySearchTree();

      customUtils.getRandomArray(100).forEach(function (n) {
        if (n !== 63) {
          bst.insert(n, 'some data for ' + n);
        }
      });

      bst.checkIsBST();

      bst.search(-2).length.should.equal(0);
      bst.search(100).length.should.equal(0);
      bst.search(101).length.should.equal(0);
      bst.search(63).length.should.equal(0);
    });

    it('Can search for data between two bounds', function () {
      var bst = new BinarySearchTree();

      [10, 5, 15, 3, 8, 13, 18].forEach(function (k) {
        bst.insert(k, 'data ' + k);
      });

      assert.deepEqual(bst.betweenBounds({ $gte: 8, $lte: 15 }), ['data 8', 'data 10', 'data 13', 'data 15']);
      assert.deepEqual(bst.betweenBounds({ $gt: 8, $lt: 15 }), ['data 10', 'data 13']);
    });

    it('Bounded search can handle cases where query contains both $lt and $lte, or both $gt and $gte', function () {
      var bst = new BinarySearchTree();

      [10, 5, 15, 3, 8, 13, 18].forEach(function (k) {
        bst.insert(k, 'data ' + k);
      });

      assert.deepEqual(bst.betweenBounds({ $gt:8, $gte: 8, $lte: 15 }), ['data 10', 'data 13', 'data 15']);
      assert.deepEqual(bst.betweenBounds({ $gt:5, $gte: 8, $lte: 15 }), ['data 8', 'data 10', 'data 13', 'data 15']);
      assert.deepEqual(bst.betweenBounds({ $gt:8, $gte: 5, $lte: 15 }), ['data 10', 'data 13', 'data 15']);

      assert.deepEqual(bst.betweenBounds({ $gte: 8, $lte: 15, $lt: 15 }), ['data 8', 'data 10', 'data 13']);
      assert.deepEqual(bst.betweenBounds({ $gte: 8, $lte: 18, $lt: 15 }), ['data 8', 'data 10', 'data 13']);
      assert.deepEqual(bst.betweenBounds({ $gte: 8, $lte: 15, $lt: 18 }), ['data 8', 'data 10', 'data 13', 'data 15']);
    });

    it('Bounded search can work when one or both boundaries are missing', function () {
      var bst = new BinarySearchTree();

      [10, 5, 15, 3, 8, 13, 18].forEach(function (k) {
        bst.insert(k, 'data ' + k);
      });

      assert.deepEqual(bst.betweenBounds({ $gte: 11 }), ['data 13', 'data 15', 'data 18']);
      assert.deepEqual(bst.betweenBounds({ $lte: 9 }), ['data 3', 'data 5', 'data 8']);
    });

  });   /// ==== End of 'Search' ==== //


  describe('Deletion', function () {

    it('Deletion does nothing on an empty tree', function () {
      var bst = new BinarySearchTree()
        , bstu = new BinarySearchTree({ unique: true });

      bst.getNumberOfKeys().should.equal(0);
      bstu.getNumberOfKeys().should.equal(0);

      bst.delete(5);
      bstu.delete(5);

      bst.hasOwnProperty('key').should.equal(false);
      bstu.hasOwnProperty('key').should.equal(false);

      bst.data.length.should.equal(0);
      bstu.data.length.should.equal(0);

      bst.getNumberOfKeys().should.equal(0);
      bstu.getNumberOfKeys().should.equal(0);
    });

    it('Deleting a non-existent key doesnt have any effect', function () {
      var bst = new BinarySearchTree();

      [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });

      function checkBst () {
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
        });
      }

      checkBst();
      bst.getNumberOfKeys().should.equal(7);

      bst.delete(2);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(4);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(9);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(6);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(11);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(14);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(20);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
      bst.delete(200);
      checkBst(); bst.checkIsBST(); bst.getNumberOfKeys().should.equal(7);
    });

    it('Able to delete the root if it is also a leaf', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'hello');
      bst.key.should.equal(10);
      _.isEqual(bst.data, ['hello']).should.equal(true);
      bst.getNumberOfKeys().should.equal(1);

      bst.delete(10);
      bst.hasOwnProperty('key').should.equal(false);
      bst.data.length.should.equal(0);
      bst.getNumberOfKeys().should.equal(0);
    });

    it('Able to delete leaf nodes that are non-root', function () {
      var bst;

      function recreateBst () {
        bst = new BinarySearchTree();

        // With this insertion order the tree is well balanced
        // So we know the leaves are 3, 8, 12, 37
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          bst.insert(k, 'some ' + k);
        });

        bst.getNumberOfKeys().should.equal(7);
      }

      function checkOnlyOneWasRemoved (theRemoved) {
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          if (k === theRemoved) {
            bst.search(k).length.should.equal(0);
          } else {
            _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
          }
        });

        bst.getNumberOfKeys().should.equal(6);
      }

      recreateBst();
      bst.delete(3);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(3);
      assert.isNull(bst.left.left);

      recreateBst();
      bst.delete(8);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(8);
      assert.isNull(bst.left.right);

      recreateBst();
      bst.delete(12);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(12);
      assert.isNull(bst.right.left);

      recreateBst();
      bst.delete(37);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(37);
      assert.isNull(bst.right.right);
    });

    it('Able to delete the root if it has only one child', function () {
      var bst;

      // Root has only one child, on the left
      bst = new BinarySearchTree();
      [10, 5, 3, 6].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(4);
      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(3);
      [5, 3, 6].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(10).length.should.equal(0);

      // Root has only one child, on the right
      bst = new BinarySearchTree();
      [10, 15, 13, 16].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(4);
      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(3);
      [15, 13, 16].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(10).length.should.equal(0);
    });

    it('Able to delete non root nodes that have only one child', function () {
      var bst;

      function recreateBst () {
        bst = new BinarySearchTree();

        [10, 5, 15, 3, 1, 4, 20, 17, 25].forEach(function (k) {
          bst.insert(k, 'some ' + k);
        });

        bst.getNumberOfKeys().should.equal(9);
      }

      function checkOnlyOneWasRemoved (theRemoved) {
        [10, 5, 15, 3, 1, 4, 20, 17, 25].forEach(function (k) {
          if (k === theRemoved) {
            bst.search(k).length.should.equal(0);
          } else {
            _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
          }
        });

        bst.getNumberOfKeys().should.equal(8);
      }

      recreateBst();
      bst.delete(5);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(5);

      recreateBst();
      bst.delete(15);
      bst.checkIsBST();
      checkOnlyOneWasRemoved(15);
    });

    it('Can delete the root if it has 2 children', function () {
      var bst;

      bst = new BinarySearchTree();
      [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(7);
      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(6);
      [5, 3, 8, 15, 12, 37].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(10).length.should.equal(0);
    });

    it('Can delete a non-root node that has two children', function () {
      var bst;

      bst = new BinarySearchTree();
      [10, 5, 3, 1, 4, 8, 6, 9, 15, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(15);
      bst.delete(5);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(14);
      [10, 3, 1, 4, 8, 6, 9, 15, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(5).length.should.equal(0);

      bst = new BinarySearchTree();
      [10, 5, 3, 1, 4, 8, 6, 9, 15, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        bst.insert(k, 'some ' + k);
      });
      bst.getNumberOfKeys().should.equal(15);
      bst.delete(15);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(14);
      [10, 5, 3, 1, 4, 8, 6, 9, 12, 11, 13, 20, 19, 42].forEach(function (k) {
        _.isEqual(bst.search(k), ['some ' + k]).should.equal(true);
      });
      bst.search(15).length.should.equal(0);
    });

    it('If no value is provided, it will delete the entire node even if there are multiple pieces of data', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes');
      bst.insert(5, 'world');
      bst.insert(8, 'yes');

      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(5);
      bst.search(5).length.should.equal(0);
      bst.getNumberOfKeys().should.equal(3);
    });

    it('Can remove only one value from an array', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes');
      bst.insert(5, 'world');
      bst.insert(8, 'yes');

      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(5, 'hello');
      assert.deepEqual(bst.search(5), ['world']);
      bst.getNumberOfKeys().should.equal(4);
    });

    it('Removes nothing if value doesnt match', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes');
      bst.insert(5, 'world');
      bst.insert(8, 'yes');

      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(5, 'nope');
      assert.deepEqual(bst.search(5), ['hello', 'world']);
      bst.getNumberOfKeys().should.equal(4);
    });

    it('If value provided but node contains only one value, remove entire node', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes2');
      bst.insert(5, 'world');
      bst.insert(8, 'yes3');

      assert.deepEqual(bst.search(3), ['yes2']);
      bst.getNumberOfKeys().should.equal(4);

      bst.delete(3, 'yes2');
      bst.search(3).length.should.equal(0);
      bst.getNumberOfKeys().should.equal(3);
    });

    it('Can remove the root from a tree with height 2 when the root has two children (special case)', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'maybe');
      bst.insert(5, 'no');
      bst.insert(15, 'yes');
      bst.getNumberOfKeys().should.equal(3);

      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(2);
      assert.deepEqual(bst.search(5), ['no']);
      assert.deepEqual(bst.search(15), ['yes']);
    });

    it('Can remove the root from a tree with height 3 when the root has two children (special case where the two children themselves have children)', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'maybe');
      bst.insert(5, 'no');
      bst.insert(15, 'yes');
      bst.insert(2, 'no');
      bst.insert(35, 'yes');
      bst.getNumberOfKeys().should.equal(5);

      bst.delete(10);
      bst.checkIsBST();
      bst.getNumberOfKeys().should.equal(4);
      assert.deepEqual(bst.search(5), ['no']);
      assert.deepEqual(bst.search(15), ['yes']);
    });

  });   // ==== End of 'Deletion' ==== //


  it('Can use undefined as key and value', function () {
    function compareKeys (a, b) {
      if (a === undefined && b === undefined) { return 0; }
      if (a === undefined) { return -1; }
      if (b === undefined) { return 1; }

      if (a < b) { return -1; }
      if (a > b) { return 1; }
      if (a === b) { return 0; }
    }

    var bst = new BinarySearchTree({ compareKeys: compareKeys });

    bst.insert(2, undefined);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(1);
    assert.deepEqual(bst.search(2), [undefined]);
    assert.deepEqual(bst.search(undefined), []);

    bst.insert(undefined, 'hello');
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(2);
    assert.deepEqual(bst.search(2), [undefined]);
    assert.deepEqual(bst.search(undefined), ['hello']);

    bst.insert(undefined, 'world');
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(2);
    assert.deepEqual(bst.search(2), [undefined]);
    assert.deepEqual(bst.search(undefined), ['hello', 'world']);

    bst.insert(4, undefined);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(3);
    assert.deepEqual(bst.search(2), [undefined]);
    assert.deepEqual(bst.search(4), [undefined]);
    assert.deepEqual(bst.search(undefined), ['hello', 'world']);

    bst.delete(undefined, 'hello');
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(3);
    assert.deepEqual(bst.search(2), [undefined]);
    assert.deepEqual(bst.search(4), [undefined]);
    assert.deepEqual(bst.search(undefined), ['world']);

    bst.delete(undefined);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(2);
    assert.deepEqual(bst.search(2), [undefined]);
    assert.deepEqual(bst.search(4), [undefined]);
    assert.deepEqual(bst.search(undefined), []);

    bst.delete(2, undefined);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(1);
    assert.deepEqual(bst.search(2), []);
    assert.deepEqual(bst.search(4), [undefined]);
    assert.deepEqual(bst.search(undefined), []);

    bst.delete(4);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(0);
    assert.deepEqual(bst.search(2), []);
    assert.deepEqual(bst.search(4), []);
    assert.deepEqual(bst.search(undefined), []);
  });


  it('Can use null as key and value', function () {
    function compareKeys (a, b) {
      if (a === null && b === null) { return 0; }
      if (a === null) { return -1; }
      if (b === null) { return 1; }

      if (a < b) { return -1; }
      if (a > b) { return 1; }
      if (a === b) { return 0; }
    }

    var bst = new BinarySearchTree({ compareKeys: compareKeys });

    bst.insert(2, null);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(1);
    assert.deepEqual(bst.search(2), [null]);
    assert.deepEqual(bst.search(null), []);

    bst.insert(null, 'hello');
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(2);
    assert.deepEqual(bst.search(2), [null]);
    assert.deepEqual(bst.search(null), ['hello']);

    bst.insert(null, 'world');
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(2);
    assert.deepEqual(bst.search(2), [null]);
    assert.deepEqual(bst.search(null), ['hello', 'world']);

    bst.insert(4, null);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(3);
    assert.deepEqual(bst.search(2), [null]);
    assert.deepEqual(bst.search(4), [null]);
    assert.deepEqual(bst.search(null), ['hello', 'world']);

    bst.delete(null, 'hello');
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(3);
    assert.deepEqual(bst.search(2), [null]);
    assert.deepEqual(bst.search(4), [null]);
    assert.deepEqual(bst.search(null), ['world']);

    bst.delete(null);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(2);
    assert.deepEqual(bst.search(2), [null]);
    assert.deepEqual(bst.search(4), [null]);
    assert.deepEqual(bst.search(null), []);

    bst.delete(2, null);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(1);
    assert.deepEqual(bst.search(2), []);
    assert.deepEqual(bst.search(4), [null]);
    assert.deepEqual(bst.search(null), []);

    bst.delete(4);
    bst.checkIsBST();
    bst.getNumberOfKeys().should.equal(0);
    assert.deepEqual(bst.search(2), []);
    assert.deepEqual(bst.search(4), []);
    assert.deepEqual(bst.search(null), []);
  });


  describe('Execute on every node (=tree traversal)', function () {

    it('Can execute a function on every node', function () {
      var bst = new BinarySearchTree()
        , keys = []
        , executed = 0
        ;

      bst.insert(10, 'yes');
      bst.insert(5, 'hello');
      bst.insert(3, 'yes2');
      bst.insert(8, 'yes3');
      bst.insert(15, 'yes3');
      bst.insert(159, 'yes3');
      bst.insert(11, 'yes3');

      bst.executeOnEveryNode(function (node) {
        keys.push(node.key);
        executed += 1;
      });

      assert.deepEqual(keys, [3, 5, 8, 10, 11, 15, 159]);
      executed.should.equal(7);
    });

  });   // ==== End of 'Execute on every node' ==== //


  // This test performs several inserts and deletes at random, always checking the content
  // of the tree are as expected and the binary search tree constraint is respected
  // This test is important because it can catch bugs other tests can't
  // By their nature, BSTs can be hard to test (many possible cases, bug at one operation whose
  // effect begins to be felt only after several operations etc.)
  describe('Randomized test (takes much longer than the rest of the test suite)', function () {
    var bst = new BinarySearchTree()
      , data = {};

    // Check a bst against a simple key => [data] object
    function checkDataIsTheSame (bst, data) {
      var bstDataElems = [];

      // bstDataElems is a simple array containing every piece of data in the tree
      bst.executeOnEveryNode(function (node) {
        var i;
        for (i = 0; i < node.data.length; i += 1) {
          bstDataElems.push(node.data[i]);
        }
      });

      // Number of key and number of pieces of data match
      bst.getNumberOfKeys().should.equal(Object.keys(data).length);
      _.reduce(_.map(data, function (d) { return d.length; }), function (memo, n) { return memo + n; }, 0).should.equal(bstDataElems.length);

      // Compare data
      Object.keys(data).forEach(function (key) {
        checkDataEquality(bst.search(key), data[key]);
      });
    }

    // Check two pieces of data coming from the bst and data are the same
    function checkDataEquality (fromBst, fromData) {
      if (fromBst.length === 0) {
        if (fromData) { fromData.length.should.equal(0); }
      }

      assert.deepEqual(fromBst, fromData);
    }

    // Tests the tree structure (deletions concern the whole tree, deletion of some data in a node is well tested above)
    it('Inserting and deleting entire nodes', function () {
      // You can skew to be more insertive or deletive, to test all cases
      function launchRandomTest (nTests, proba) {
        var i, key, dataPiece, possibleKeys;

        for (i = 0; i < nTests; i += 1) {
          if (Math.random() > proba) {   // Deletion
            possibleKeys = Object.keys(data);

            if (possibleKeys.length > 0) {
              key = possibleKeys[Math.floor(possibleKeys.length * Math.random()).toString()];
            } else {
              key = Math.floor(70 * Math.random()).toString();
            }

            delete data[key];
            bst.delete(key);
          } else {   // Insertion
            key = Math.floor(70 * Math.random()).toString();
            dataPiece = Math.random().toString().substring(0, 6);
            bst.insert(key, dataPiece);
            if (data[key]) {
              data[key].push(dataPiece);
            } else {
              data[key] = [dataPiece];
            }
          }

          // Check the bst constraint are still met and the data is correct
          bst.checkIsBST();
          checkDataIsTheSame(bst, data);
        }
      }

      launchRandomTest(1000, 0.65);
      launchRandomTest(2000, 0.35);
    });

  });   // ==== End of 'Randomized test' ==== //



});
