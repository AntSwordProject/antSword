var should = require('chai').should()
  , assert = require('chai').assert
  , AVLTree = require('../index').AVLTree
  , _ = require('underscore')
  , customUtils = require('../lib/customUtils')
  ;


describe('AVL tree', function () {

  describe('Sanity checks', function () {

    it('Checking that all nodes heights are correct', function () {
      var _AVLTree = AVLTree._AVLTree
        , avlt = new _AVLTree({ key: 10 })
        , l = new _AVLTree({ key: 5 })
        , r = new _AVLTree({ key: 15 })
        , ll = new _AVLTree({ key: 3 })
        , lr = new _AVLTree({ key: 8 })
        , rl = new _AVLTree({ key: 13 })
        , rr = new _AVLTree({ key: 18 })
        , lrl = new _AVLTree({ key: 7 })
        , lrll = new _AVLTree({ key: 6 })
        ;


      // With a balanced tree
      avlt.left = l;
      avlt.right = r;
      l.left = ll;
      l.right = lr;
      r.left = rl;
      r.right = rr;

      (function () { avlt.checkHeightCorrect() }).should.throw();
      avlt.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      l.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      r.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      ll.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      lr.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      rl.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      rr.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      avlt.height = 2;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      l.height = 2;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      r.height = 2;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      avlt.height = 3;
      avlt.checkHeightCorrect();   // Correct

      // With an unbalanced tree
      lr.left = lrl;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      lrl.left = lrll;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      lrl.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      lrll.height = 1;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      lrl.height = 2;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      lr.height = 3;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      l.height = 4;
      (function () { avlt.checkHeightCorrect() }).should.throw();
      avlt.height = 5;
      avlt.checkHeightCorrect();   // Correct
    });

    it('Calculate the balance factor', function () {
      var _AVLTree = AVLTree._AVLTree
        , avlt = new _AVLTree({ key: 10 })
        , l = new _AVLTree({ key: 5 })
        , r = new _AVLTree({ key: 15 })
        , ll = new _AVLTree({ key: 3 })
        , lr = new _AVLTree({ key: 8 })
        , rl = new _AVLTree({ key: 13 })
        , rr = new _AVLTree({ key: 18 })
        , lrl = new _AVLTree({ key: 7 })
        , lrll = new _AVLTree({ key: 6 })
        ;


      // With a balanced tree
      avlt.left = l;
      avlt.right = r;
      l.left = ll;
      l.right = lr;
      r.left = rl;
      r.right = rr;

      ll.height = 1;
      rl.height = 1;
      rr.height = 1;
      avlt.height = 2;
      r.height = 2;
      lr.left = lrl;
      lrl.left = lrll;
      lrl.height = 1;
      lrll.height = 1;
      lrl.height = 2;
      lr.height = 3;
      l.height = 4;
      avlt.height = 5;
      avlt.checkHeightCorrect();   // Correct

      lrll.balanceFactor().should.equal(0);
      lrl.balanceFactor().should.equal(1);
      ll.balanceFactor().should.equal(0);
      lr.balanceFactor().should.equal(2);
      rl.balanceFactor().should.equal(0);
      rr.balanceFactor().should.equal(0);
      l.balanceFactor().should.equal(-2);
      r.balanceFactor().should.equal(0);
      avlt.balanceFactor().should.equal(2);
    });

    it('Can check that a tree is balanced', function () {
      var _AVLTree = AVLTree._AVLTree
        , avlt = new _AVLTree({ key: 10 })
        , l = new _AVLTree({ key: 5 })
        , r = new _AVLTree({ key: 15 })
        , ll = new _AVLTree({ key: 3 })
        , lr = new _AVLTree({ key: 8 })
        , rl = new _AVLTree({ key: 13 })
        , rr = new _AVLTree({ key: 18 })

      avlt.left = l;
      avlt.right = r;
      l.left = ll;
      l.right = lr;
      r.left = rl;
      r.right = rr;

      ll.height = 1;
      lr.height = 1;
      rl.height = 1;
      rr.height = 1;
      l.height = 2;
      r.height = 2;
      avlt.height = 3;
      avlt.checkBalanceFactors();

      r.height = 0;
      (function () { avlt.checkBalanceFactors(); }).should.throw();
      r.height = 4;
      (function () { avlt.checkBalanceFactors(); }).should.throw();
      r.height = 2;
      avlt.checkBalanceFactors();

      ll.height = -1;
      (function () { avlt.checkBalanceFactors(); }).should.throw();
      ll.height = 3;
      (function () { avlt.checkBalanceFactors(); }).should.throw();
      ll.height = 1;
      avlt.checkBalanceFactors();

      rl.height = -1;
      (function () { avlt.checkBalanceFactors(); }).should.throw();
      rl.height = 3;
      (function () { avlt.checkBalanceFactors(); }).should.throw();
      rl.height = 1;
      avlt.checkBalanceFactors();
    });

  });   // ==== End of 'Sanity checks' ==== //


  describe('Insertion', function () {

    it('The root has a height of 1', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'root');
      avlt.tree.height.should.equal(1);
    });


    it('Insert at the root if its the first insertion', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'some data');

      avlt.checkIsAVLT();
      avlt.tree.key.should.equal(10);
      _.isEqual(avlt.tree.data, ['some data']).should.equal(true);
      assert.isNull(avlt.tree.left);
      assert.isNull(avlt.tree.right);
    });

    it('If uniqueness constraint not enforced, we can insert different data for same key', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'some data');
      avlt.insert(3, 'hello');
      avlt.insert(3, 'world');

      avlt.checkIsAVLT();
      _.isEqual(avlt.search(3), ['hello', 'world']).should.equal(true);

      avlt.insert(12, 'a');
      avlt.insert(12, 'b');

      avlt.checkIsAVLT();
      _.isEqual(avlt.search(12), ['a', 'b']).should.equal(true);
    });

    it('If uniqueness constraint is enforced, we cannot insert different data for same key', function () {
      var avlt = new AVLTree({ unique: true });

      avlt.insert(10, 'some data');
      avlt.insert(3, 'hello');
      try {
        avlt.insert(3, 'world');
      } catch (e) {
        e.errorType.should.equal('uniqueViolated');
        e.key.should.equal(3);
      }

      avlt.checkIsAVLT();
      _.isEqual(avlt.search(3), ['hello']).should.equal(true);

      avlt.insert(12, 'a');
      try {
        avlt.insert(12, 'world');
      } catch (e) {
        e.errorType.should.equal('uniqueViolated');
        e.key.should.equal(12);
      }

      avlt.checkIsAVLT();
      _.isEqual(avlt.search(12), ['a']).should.equal(true);
    });

    it('Can insert 0 or the empty string', function () {
      var avlt = new AVLTree();

      avlt.insert(0, 'some data');

      avlt.checkIsAVLT();
      avlt.tree.key.should.equal(0);
      _.isEqual(avlt.tree.data, ['some data']).should.equal(true);

      avlt = new AVLTree();

      avlt.insert('', 'some other data');

      avlt.checkIsAVLT();
      avlt.tree.key.should.equal('');
      _.isEqual(avlt.tree.data, ['some other data']).should.equal(true);
    });

    it('Auto-balancing insertions', function () {
      var avlt = new AVLTree()
        , avlt2 = new AVLTree()
        , avlt3 = new AVLTree()
        ;

      // Balancing insertions on the left
      avlt.tree.getNumberOfKeys().should.equal(0);
      avlt.insert(18);
      avlt.tree.getNumberOfKeys().should.equal(1);
      avlt.tree.checkIsAVLT();
      avlt.insert(15);
      avlt.tree.getNumberOfKeys().should.equal(2);
      avlt.tree.checkIsAVLT();
      avlt.insert(13);
      avlt.tree.getNumberOfKeys().should.equal(3);
      avlt.tree.checkIsAVLT();
      avlt.insert(10);
      avlt.tree.getNumberOfKeys().should.equal(4);
      avlt.tree.checkIsAVLT();
      avlt.insert(8);
      avlt.tree.getNumberOfKeys().should.equal(5);
      avlt.tree.checkIsAVLT();
      avlt.insert(5);
      avlt.tree.getNumberOfKeys().should.equal(6);
      avlt.tree.checkIsAVLT();
      avlt.insert(3);
      avlt.tree.getNumberOfKeys().should.equal(7);
      avlt.tree.checkIsAVLT();

      // Balancing insertions on the right
      avlt2.tree.getNumberOfKeys().should.equal(0);
      avlt2.insert(3);
      avlt2.tree.getNumberOfKeys().should.equal(1);
      avlt2.tree.checkIsAVLT();
      avlt2.insert(5);
      avlt2.tree.getNumberOfKeys().should.equal(2);
      avlt2.tree.checkIsAVLT();
      avlt2.insert(8);
      avlt2.tree.getNumberOfKeys().should.equal(3);
      avlt2.tree.checkIsAVLT();
      avlt2.insert(10);
      avlt2.tree.getNumberOfKeys().should.equal(4);
      avlt2.tree.checkIsAVLT();
      avlt2.insert(13);
      avlt2.tree.getNumberOfKeys().should.equal(5);
      avlt2.tree.checkIsAVLT();
      avlt2.insert(15);
      avlt2.tree.getNumberOfKeys().should.equal(6);
      avlt2.tree.checkIsAVLT();
      avlt2.insert(18);
      avlt2.tree.getNumberOfKeys().should.equal(7);
      avlt2.tree.checkIsAVLT();

      // Balancing already-balanced insertions
      avlt3.tree.getNumberOfKeys().should.equal(0);
      avlt3.insert(10);
      avlt3.tree.getNumberOfKeys().should.equal(1);
      avlt3.tree.checkIsAVLT();
      avlt3.insert(5);
      avlt3.tree.getNumberOfKeys().should.equal(2);
      avlt3.tree.checkIsAVLT();
      avlt3.insert(15);
      avlt3.tree.getNumberOfKeys().should.equal(3);
      avlt3.tree.checkIsAVLT();
      avlt3.insert(3);
      avlt3.tree.getNumberOfKeys().should.equal(4);
      avlt3.tree.checkIsAVLT();
      avlt3.insert(8);
      avlt3.tree.getNumberOfKeys().should.equal(5);
      avlt3.tree.checkIsAVLT();
      avlt3.insert(13);
      avlt3.tree.getNumberOfKeys().should.equal(6);
      avlt3.tree.checkIsAVLT();
      avlt3.insert(18);
      avlt3.tree.getNumberOfKeys().should.equal(7);
      avlt3.tree.checkIsAVLT();
    });

    it('Can insert a lot of keys and still get an AVLT (sanity check)', function () {
      var avlt = new AVLTree({ unique: true });

      customUtils.getRandomArray(1000).forEach(function (n) {
        avlt.insert(n, 'some data');
        avlt.checkIsAVLT();
      });

    });

  });   // ==== End of 'Insertion' ==== //


  describe('Search', function () {

    it('Can find data in an AVLT', function () {
      var avlt = new AVLTree()
        , i;

      customUtils.getRandomArray(100).forEach(function (n) {
        avlt.insert(n, 'some data for ' + n);
      });

      avlt.checkIsAVLT();

      for (i = 0; i < 100; i += 1) {
        _.isEqual(avlt.search(i), ['some data for ' + i]).should.equal(true);
      }
    });

    it('If no data can be found, return an empty array', function () {
      var avlt = new AVLTree();

      customUtils.getRandomArray(100).forEach(function (n) {
        if (n !== 63) {
          avlt.insert(n, 'some data for ' + n);
        }
      });

      avlt.checkIsAVLT();

      avlt.search(-2).length.should.equal(0);
      avlt.search(100).length.should.equal(0);
      avlt.search(101).length.should.equal(0);
      avlt.search(63).length.should.equal(0);
    });

    it('Can search for data between two bounds', function () {
      var avlt = new AVLTree();

      [10, 5, 15, 3, 8, 13, 18].forEach(function (k) {
        avlt.insert(k, 'data ' + k);
      });

      assert.deepEqual(avlt.betweenBounds({ $gte: 8, $lte: 15 }), ['data 8', 'data 10', 'data 13', 'data 15']);
      assert.deepEqual(avlt.betweenBounds({ $gt: 8, $lt: 15 }), ['data 10', 'data 13']);
    });

    it('Bounded search can handle cases where query contains both $lt and $lte, or both $gt and $gte', function () {
      var avlt = new AVLTree();

      [10, 5, 15, 3, 8, 13, 18].forEach(function (k) {
        avlt.insert(k, 'data ' + k);
      });

      assert.deepEqual(avlt.betweenBounds({ $gt:8, $gte: 8, $lte: 15 }), ['data 10', 'data 13', 'data 15']);
      assert.deepEqual(avlt.betweenBounds({ $gt:5, $gte: 8, $lte: 15 }), ['data 8', 'data 10', 'data 13', 'data 15']);
      assert.deepEqual(avlt.betweenBounds({ $gt:8, $gte: 5, $lte: 15 }), ['data 10', 'data 13', 'data 15']);

      assert.deepEqual(avlt.betweenBounds({ $gte: 8, $lte: 15, $lt: 15 }), ['data 8', 'data 10', 'data 13']);
      assert.deepEqual(avlt.betweenBounds({ $gte: 8, $lte: 18, $lt: 15 }), ['data 8', 'data 10', 'data 13']);
      assert.deepEqual(avlt.betweenBounds({ $gte: 8, $lte: 15, $lt: 18 }), ['data 8', 'data 10', 'data 13', 'data 15']);
    });

    it('Bounded search can work when one or both boundaries are missing', function () {
      var avlt = new AVLTree();

      [10, 5, 15, 3, 8, 13, 18].forEach(function (k) {
        avlt.insert(k, 'data ' + k);
      });

      assert.deepEqual(avlt.betweenBounds({ $gte: 11 }), ['data 13', 'data 15', 'data 18']);
      assert.deepEqual(avlt.betweenBounds({ $lte: 9 }), ['data 3', 'data 5', 'data 8']);
    });

  });   /// ==== End of 'Search' ==== //


  describe('Deletion', function () {

    it('Deletion does nothing on an empty tree', function () {
      var avlt = new AVLTree()
        , avltu = new AVLTree({ unique: true });

      avlt.getNumberOfKeys().should.equal(0);
      avltu.getNumberOfKeys().should.equal(0);

      avlt.delete(5);
      avltu.delete(5);

      avlt.tree.hasOwnProperty('key').should.equal(false);
      avltu.tree.hasOwnProperty('key').should.equal(false);

      avlt.tree.data.length.should.equal(0);
      avltu.tree.data.length.should.equal(0);

      avlt.getNumberOfKeys().should.equal(0);
      avltu.getNumberOfKeys().should.equal(0);
    });

    it('Deleting a non-existent key doesnt have any effect', function () {
      var avlt = new AVLTree();

      [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });

      function checkavlt () {
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          _.isEqual(avlt.search(k), ['some ' + k]).should.equal(true);
        });
      }

      checkavlt();
      avlt.getNumberOfKeys().should.equal(7);

      avlt.delete(2);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(4);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(9);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(6);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(11);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(14);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(20);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(200);
      checkavlt(); avlt.checkIsAVLT(); avlt.getNumberOfKeys().should.equal(7);
    });

    it('Able to delete the root if it is also a leaf', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'hello');
      avlt.tree.key.should.equal(10);
      _.isEqual(avlt.tree.data, ['hello']).should.equal(true);
      avlt.getNumberOfKeys().should.equal(1);

      avlt.delete(10);
      avlt.tree.hasOwnProperty('key').should.equal(false);
      avlt.tree.data.length.should.equal(0);
      avlt.getNumberOfKeys().should.equal(0);
    });

    it('Able to delete leaf nodes that are non-root', function () {
      var avlt;

      // This will create an AVL tree with leaves 3, 8, 12, 37
      // (do a pretty print to see this)
      function recreateavlt () {
        avlt = new AVLTree();

        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          avlt.insert(k, 'some ' + k);
        });

        avlt.getNumberOfKeys().should.equal(7);
      }

      // Check that only keys in array theRemoved were removed
      function checkRemoved (theRemoved) {
        [10, 5, 3, 8, 15, 12, 37].forEach(function (k) {
          if (theRemoved.indexOf(k) !== -1) {
            avlt.search(k).length.should.equal(0);
          } else {
            _.isEqual(avlt.search(k), ['some ' + k]).should.equal(true);
          }
        });

        avlt.getNumberOfKeys().should.equal(7 - theRemoved.length);
      }

      recreateavlt();
      avlt.delete(3);
      avlt.checkIsAVLT();
      checkRemoved([3]);

      recreateavlt();
      avlt.delete(8);
      avlt.checkIsAVLT();
      checkRemoved([8]);

      recreateavlt();
      avlt.delete(12);
      avlt.checkIsAVLT();
      checkRemoved([12]);

      // Delete all leaves in a way that makes the tree unbalanced
      recreateavlt();
      avlt.delete(37);
      avlt.checkIsAVLT();
      checkRemoved([37]);

      avlt.delete(12);
      avlt.checkIsAVLT();
      checkRemoved([12, 37]);

      avlt.delete(15);
      avlt.checkIsAVLT();
      checkRemoved([12, 15, 37]);

      avlt.delete(3);
      avlt.checkIsAVLT();
      checkRemoved([3, 12, 15, 37]);

      avlt.delete(5);
      avlt.checkIsAVLT();
      checkRemoved([3, 5, 12, 15, 37]);

      avlt.delete(10);
      avlt.checkIsAVLT();
      checkRemoved([3, 5, 10, 12, 15, 37]);

      avlt.delete(8);
      avlt.checkIsAVLT();
      checkRemoved([3, 5, 8, 10, 12, 15, 37]);
    });

    it('Able to delete the root if it has only one child', function () {
      var avlt;

      // Root has only one child, on the left
      avlt = new AVLTree();
      [10, 5].forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });
      avlt.getNumberOfKeys().should.equal(2);
      avlt.delete(10);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(1);
      _.isEqual(avlt.search(5), ['some 5']).should.equal(true);
      avlt.search(10).length.should.equal(0);

      // Root has only one child, on the right
      avlt = new AVLTree();
      [10, 15].forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });
      avlt.getNumberOfKeys().should.equal(2);
      avlt.delete(10);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(1);
      _.isEqual(avlt.search(15), ['some 15']).should.equal(true);
      avlt.search(10).length.should.equal(0);
    });

    it('Able to delete non root nodes that have only one child', function () {
      var avlt = new AVLTree()
        , firstSet = [10, 5, 15, 3, 1, 4, 20]
        , secondSet = [10, 5, 15, 3, 1, 4, 20, 17, 25]
        ;

      // Check that only keys in array theRemoved were removed
      function checkRemoved (set, theRemoved) {
        set.forEach(function (k) {
          if (theRemoved.indexOf(k) !== -1) {
            avlt.search(k).length.should.equal(0);
          } else {
            _.isEqual(avlt.search(k), ['some ' + k]).should.equal(true);
          }
        });

        avlt.getNumberOfKeys().should.equal(set.length - theRemoved.length);
      }

      // First set: no rebalancing necessary
      firstSet.forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });

      avlt.getNumberOfKeys().should.equal(7);
      avlt.checkIsAVLT();

      avlt.delete(4);   // Leaf
      avlt.checkIsAVLT();
      checkRemoved(firstSet, [4]);

      avlt.delete(3);   // Node with only one child (on the left)
      avlt.checkIsAVLT();
      checkRemoved(firstSet, [3, 4]);

      avlt.delete(10);   // Leaf
      avlt.checkIsAVLT();
      checkRemoved(firstSet, [3, 4, 10]);

      avlt.delete(15);   // Node with only one child (on the right)
      avlt.checkIsAVLT();
      checkRemoved(firstSet, [3, 4, 10, 15]);

      // Second set: some rebalancing necessary
      avlt = new AVLTree();
      secondSet.forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });

      avlt.delete(4);   // Leaf
      avlt.checkIsAVLT();
      checkRemoved(secondSet, [4]);

      avlt.delete(3);   // Node with only one child (on the left), causes rebalancing
      avlt.checkIsAVLT();
      checkRemoved(secondSet, [3, 4]);
    });

    it('Can delete the root if it has 2 children', function () {
      var avlt = new AVLTree();

      // No rebalancing needed
      [10, 5, 15, 3, 8, 12, 37].forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });
      avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(10);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(6);
      [5, 3, 8, 15, 12, 37].forEach(function (k) {
        _.isEqual(avlt.search(k), ['some ' + k]).should.equal(true);
      });
      avlt.search(10).length.should.equal(0);

      // Rebalancing needed
      avlt = new AVLTree();
      [10, 5, 15, 8, 12, 37, 42].forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });
      avlt.getNumberOfKeys().should.equal(7);
      avlt.delete(10);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(6);
      [5, 8, 15, 12, 37, 42].forEach(function (k) {
        _.isEqual(avlt.search(k), ['some ' + k]).should.equal(true);
      });
      avlt.search(10).length.should.equal(0);
    });

    it('Can delete a non-root node that has two children', function () {
      var avlt;

      // On the left
      avlt = new AVLTree();
      [10, 5, 15, 3, 8, 12, 20, 1, 4, 6, 9, 11, 13, 19, 42, 3.5].forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });
      avlt.getNumberOfKeys().should.equal(16);
      avlt.delete(5);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(15);
      [10, 3, 1, 4, 8, 6, 9, 15, 12, 11, 13, 20, 19, 42, 3.5].forEach(function (k) {
        _.isEqual(avlt.search(k), ['some ' + k]).should.equal(true);
      });
      avlt.search(5).length.should.equal(0);

      // On the right
      avlt = new AVLTree();
      [10, 5, 15, 3, 8, 12, 20, 1, 4, 6, 9, 11, 13, 19, 42, 12.5].forEach(function (k) {
        avlt.insert(k, 'some ' + k);
      });
      avlt.getNumberOfKeys().should.equal(16);
      avlt.delete(15);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(15);
      [10, 3, 1, 4, 8, 6, 9, 5, 12, 11, 13, 20, 19, 42, 12.5].forEach(function (k) {
        _.isEqual(avlt.search(k), ['some ' + k]).should.equal(true);
      });
      avlt.search(15).length.should.equal(0);
    });

    it('If no value is provided, it will delete the entire node even if there are multiple pieces of data', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'yes');
      avlt.insert(5, 'hello');
      avlt.insert(3, 'yes');
      avlt.insert(5, 'world');
      avlt.insert(8, 'yes');

      assert.deepEqual(avlt.search(5), ['hello', 'world']);
      avlt.getNumberOfKeys().should.equal(4);

      avlt.delete(5);
      avlt.checkIsAVLT();
      avlt.search(5).length.should.equal(0);
      avlt.getNumberOfKeys().should.equal(3);
    });

    it('Can remove only one value from an array', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'yes');
      avlt.insert(5, 'hello');
      avlt.insert(3, 'yes');
      avlt.insert(5, 'world');
      avlt.insert(8, 'yes');

      assert.deepEqual(avlt.search(5), ['hello', 'world']);
      avlt.getNumberOfKeys().should.equal(4);

      avlt.delete(5, 'hello');
      avlt.checkIsAVLT();
      assert.deepEqual(avlt.search(5), ['world']);
      avlt.getNumberOfKeys().should.equal(4);
    });

    it('Removes nothing if value doesnt match', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'yes');
      avlt.insert(5, 'hello');
      avlt.insert(3, 'yes');
      avlt.insert(5, 'world');
      avlt.insert(8, 'yes');

      assert.deepEqual(avlt.search(5), ['hello', 'world']);
      avlt.getNumberOfKeys().should.equal(4);

      avlt.delete(5, 'nope');
      avlt.checkIsAVLT();
      assert.deepEqual(avlt.search(5), ['hello', 'world']);
      avlt.getNumberOfKeys().should.equal(4);
    });

    it('If value provided but node contains only one value, remove entire node', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'yes');
      avlt.insert(5, 'hello');
      avlt.insert(3, 'yes2');
      avlt.insert(5, 'world');
      avlt.insert(8, 'yes3');

      assert.deepEqual(avlt.search(3), ['yes2']);
      avlt.getNumberOfKeys().should.equal(4);

      avlt.delete(3, 'yes2');
      avlt.checkIsAVLT();
      avlt.search(3).length.should.equal(0);
      avlt.getNumberOfKeys().should.equal(3);
    });

    it('Can remove the root from a tree with height 2 when the root has two children (special case)', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'maybe');
      avlt.insert(5, 'no');
      avlt.insert(15, 'yes');
      avlt.getNumberOfKeys().should.equal(3);

      avlt.delete(10);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(2);
      assert.deepEqual(avlt.search(5), ['no']);
      assert.deepEqual(avlt.search(15), ['yes']);
    });

    it('Can remove the root from a tree with height 3 when the root has two children (special case where the two children themselves have children)', function () {
      var avlt = new AVLTree();

      avlt.insert(10, 'maybe');
      avlt.insert(5, 'no');
      avlt.insert(15, 'yes');
      avlt.insert(2, 'no');
      avlt.insert(35, 'yes');
      avlt.getNumberOfKeys().should.equal(5);

      avlt.delete(10);
      avlt.checkIsAVLT();
      avlt.getNumberOfKeys().should.equal(4);
      assert.deepEqual(avlt.search(5), ['no']);
      assert.deepEqual(avlt.search(15), ['yes']);
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

    var avlt = new AVLTree({ compareKeys: compareKeys });

    avlt.insert(2, undefined);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(1);
    assert.deepEqual(avlt.search(2), [undefined]);
    assert.deepEqual(avlt.search(undefined), []);

    avlt.insert(undefined, 'hello');
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(2);
    assert.deepEqual(avlt.search(2), [undefined]);
    assert.deepEqual(avlt.search(undefined), ['hello']);

    avlt.insert(undefined, 'world');
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(2);
    assert.deepEqual(avlt.search(2), [undefined]);
    assert.deepEqual(avlt.search(undefined), ['hello', 'world']);

    avlt.insert(4, undefined);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(3);
    assert.deepEqual(avlt.search(2), [undefined]);
    assert.deepEqual(avlt.search(4), [undefined]);
    assert.deepEqual(avlt.search(undefined), ['hello', 'world']);

    avlt.delete(undefined, 'hello');
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(3);
    assert.deepEqual(avlt.search(2), [undefined]);
    assert.deepEqual(avlt.search(4), [undefined]);
    assert.deepEqual(avlt.search(undefined), ['world']);

    avlt.delete(undefined);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(2);
    assert.deepEqual(avlt.search(2), [undefined]);
    assert.deepEqual(avlt.search(4), [undefined]);
    assert.deepEqual(avlt.search(undefined), []);

    avlt.delete(2, undefined);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(1);
    assert.deepEqual(avlt.search(2), []);
    assert.deepEqual(avlt.search(4), [undefined]);
    assert.deepEqual(avlt.search(undefined), []);

    avlt.delete(4);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(0);
    assert.deepEqual(avlt.search(2), []);
    assert.deepEqual(avlt.search(4), []);
    assert.deepEqual(avlt.search(undefined), []);
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

    var avlt = new AVLTree({ compareKeys: compareKeys });

    avlt.insert(2, null);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(1);
    assert.deepEqual(avlt.search(2), [null]);
    assert.deepEqual(avlt.search(null), []);

    avlt.insert(null, 'hello');
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(2);
    assert.deepEqual(avlt.search(2), [null]);
    assert.deepEqual(avlt.search(null), ['hello']);

    avlt.insert(null, 'world');
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(2);
    assert.deepEqual(avlt.search(2), [null]);
    assert.deepEqual(avlt.search(null), ['hello', 'world']);

    avlt.insert(4, null);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(3);
    assert.deepEqual(avlt.search(2), [null]);
    assert.deepEqual(avlt.search(4), [null]);
    assert.deepEqual(avlt.search(null), ['hello', 'world']);

    avlt.delete(null, 'hello');
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(3);
    assert.deepEqual(avlt.search(2), [null]);
    assert.deepEqual(avlt.search(4), [null]);
    assert.deepEqual(avlt.search(null), ['world']);

    avlt.delete(null);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(2);
    assert.deepEqual(avlt.search(2), [null]);
    assert.deepEqual(avlt.search(4), [null]);
    assert.deepEqual(avlt.search(null), []);

    avlt.delete(2, null);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(1);
    assert.deepEqual(avlt.search(2), []);
    assert.deepEqual(avlt.search(4), [null]);
    assert.deepEqual(avlt.search(null), []);

    avlt.delete(4);
    avlt.checkIsAVLT();
    avlt.getNumberOfKeys().should.equal(0);
    assert.deepEqual(avlt.search(2), []);
    assert.deepEqual(avlt.search(4), []);
    assert.deepEqual(avlt.search(null), []);
  });


  describe('Execute on every node (=tree traversal)', function () {

    it('Can execute a function on every node', function () {
      var avlt = new AVLTree()
        , keys = []
        , executed = 0
        ;

      avlt.insert(10, 'yes');
      avlt.insert(5, 'hello');
      avlt.insert(3, 'yes2');
      avlt.insert(8, 'yes3');
      avlt.insert(15, 'yes3');
      avlt.insert(159, 'yes3');
      avlt.insert(11, 'yes3');

      avlt.executeOnEveryNode(function (node) {
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
    var avlt = new AVLTree()
      , data = {};

    // Check a avlt against a simple key => [data] object
    function checkDataIsTheSame (avlt, data) {
      var avltDataElems = [];

      // avltDataElems is a simple array containing every piece of data in the tree
      avlt.executeOnEveryNode(function (node) {
        var i;
        for (i = 0; i < node.data.length; i += 1) {
          avltDataElems.push(node.data[i]);
        }
      });

      // Number of key and number of pieces of data match
      avlt.getNumberOfKeys().should.equal(Object.keys(data).length);
      _.reduce(_.map(data, function (d) { return d.length; }), function (memo, n) { return memo + n; }, 0).should.equal(avltDataElems.length);

      // Compare data
      Object.keys(data).forEach(function (key) {
        checkDataEquality(avlt.search(key), data[key]);
      });
    }

    // Check two pieces of data coming from the avlt and data are the same
    function checkDataEquality (fromavlt, fromData) {
      if (fromavlt.length === 0) {
        if (fromData) { fromData.length.should.equal(0); }
      }

      assert.deepEqual(fromavlt, fromData);
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
            avlt.delete(key);
          } else {   // Insertion
            key = Math.floor(70 * Math.random()).toString();
            dataPiece = Math.random().toString().substring(0, 6);

            avlt.insert(key, dataPiece);
            if (data[key]) {
              data[key].push(dataPiece);
            } else {
              data[key] = [dataPiece];
            }
          }

          // Check the avlt constraint are still met and the data is correct
          avlt.checkIsAVLT();
          checkDataIsTheSame(avlt, data);
        }
      }

      launchRandomTest(1000, 0.65);
      launchRandomTest(2000, 0.35);
    });

  });   // ==== End of 'Randomized test' ==== //

});









