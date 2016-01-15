//perform testing here and reload your index.html file to see $v() at work
//$v('.testing-p')

  $v('.testing-p')
  .find('a')
  .attr('href', 'http://cardinalsolutions.com')
  .data('testing', 'this worked');

console.log(
  $v('.testing-p')
  .find('a')
  .attr('href')
);

console.log(
  $v('.testing-p')
  .find('a')
  .data('testing')
);

var test = {
  testing: {
    that: 42,
    and: "testing",
    other: {
      something: "different"
    }
  }
};
var test2 = {
  testing: {
    changed: 'CHANGED'
  }
};

var test3 = {};
$v.extend(true, test3, test, test2);

console.log('test', test);
console.log('test2', test2);
console.log('test3', test3);
