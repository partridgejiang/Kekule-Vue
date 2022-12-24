let $root;
if (typeof(window) === 'object' && window && window.document)
	$root = window;
else if (typeof(global) === 'object')  // node env
	$root = global;
else if (typeof(self) === 'object')
	$root = self;

let Kekule = $root.Kekule;

/**
 * Namespace of Kekule-Vue.
 * @namespace
 */
Kekule.Vue = {};

let KekuleVue = Kekule.Vue;

export { Kekule, KekuleVue };