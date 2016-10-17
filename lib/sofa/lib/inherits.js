module.exports = function(Subclass, ParentClass) {
  Subclass.prototype = Object.create(ParentClass.prototype);
  Subclass.prototype.constructor = Subclass;
}