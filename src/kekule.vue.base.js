let $root;
if (typeof(window) === 'object' && window && window.document)
	$root = window;
else if (typeof(global) === 'object')  // node env
	$root = global;
else if (typeof(self) === 'object')
	$root = self;

let Kekule = $root.Kekule;
let ClassEx = Kekule.ClassEx;

/**
 * Namespace of Kekule-Vue.
 * @namespace
 */
Kekule.Vue = {};

let KekuleVue = Kekule.Vue;

KekuleVue.VERSION = '0.1.0';

export { ClassEx, Kekule, KekuleVue };