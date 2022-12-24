import { h } from 'vue';
import { Kekule, KekuleVue } from './kekule.vue.base.js';

Kekule.globalOptions.add('Vue.widgetWrapper', {
	exposeWidgetPropertiesToVueComputes: true,
	exposeWidgetPropertiesToVueProps: true,
	//exposeWidgetMethods: false,
	// widget properties may conflict with element, should not be exposed in wrapping
	ignoredProperties: ['id', 'draggable', 'droppable', 'innerHTML', 'style', 'offsetParent', 'offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight'],
	vuePropNamePrefix: 'initial'
});

/**
 * Util functions of Kekule-Vue.
 * @class
 */
KekuleVue.Utils = {
	/**
	 * Wrap a Kekule widget into vue component.
	 * @param {Class} widgetClass
	 * //@param {String} vueTag Vue element tag name binding with this component.
	 * @param {Hash} options May include fields:
	 *   {
	 *     exposeWidgetPropertiesToVueComputes: bool, whether add [kekulePropName] to vue component compute props
	 *     exposeWidgetPropertiesToVueProps: bool, whether add initial[KekulePropName] props to vue component
	 *     exposedProperties: array,
	 *     ignoredProperties: array
	 *   }
	 * @returns {Object} Vue component.
	 */
	wrapWidget: function(widgetClass, options)
	{
		let globalOptions = Kekule.globalOptions.Vue.widgetWrapper;
		let ops = Object.extend({
			exposeWidgetPropertiesToVueComputes: globalOptions.exposeWidgetPropertiesToVueComputes,
			exposeWidgetPropertiesToVueProps: globalOptions.exposeWidgetPropertiesToVueProps,
			ignoredProperties: globalOptions.ignoredProperties,
			exposeWidgetMethods: globalOptions.exposeWidgetMethods,
			vuePropNamePrefix: globalOptions.vuePropNamePrefix
		}, options || {});
		let vuePropNamePrefix = ops.vuePropNamePrefix;

		let props = ClassEx.getAllPropList(widgetClass);
		let vueComputes = {}, vueProps = [], vueWatches = {};
		for (let i = 0, l = props.getLength(); i < l; ++i)
		{
			var propInfo = props.getPropInfoAt(i)
			if (propInfo.scope < Class.PropertyScope.PUBLIC)
				continue;
			if (ops.exposedProperties && ops.exposedProperties.indexOf(propInfo.name) < 0)
				continue;
			if (ops.ignoredProperties && ops.ignoredProperties.indexOf(propInfo.name) >= 0)
				continue;

			let propName = propInfo.name;
			if (ops.exposeWidgetPropertiesToVueComputes)
			{
				if (propInfo.getter)  // do not expose write only prop to vue compute
				{
					vueComputes[propName] = {};
					vueComputes[propName].get = function ()
					{
						return this.widget && this.widget.getPropValue(propName);
					}
					if (propInfo.setter)
					{
						vueComputes[propName].set = function (value)
						{
							if (!this.__updateComputePropValueCache__)  // special flag, means we are update the vue compute prop cache, no need to actually change the widget
							{
								if (!this.widget)
									return;
								this.__setComputePropValue__ = true;   // special flag, means the kekule property is changed by vue component
								try
								{
									this.widget.setPropValue(propName, value);
								} finally
								{
									this.__setComputePropValue__ = false;
								}
							}
						}
					}
				}
			}

			if (ops.exposeWidgetPropertiesToVueProps)
			{
				if (propInfo.setter)  // only writable property can be exposed to vue props
				{
					let vuePropName = vuePropNamePrefix + propName.charAt(0).toUpperCase() + propName.substr(1);
					vueProps.push(vuePropName);
					/*
					// Vue props are readonly to component, no need to watch their change
					vueWatches[vuePropName] = (newVal, oldVal) =>
					{
						if (this.widget)
						{
							this._setKekulePropValueByVueProp(vuePropName, newVal);
						}
					}
					*/
				}
			}
		}

		let vueComponent = {
			computed: vueComputes,
			props: vueProps,
			methods: {
				getWidget() { return this.widget; },
				_initWidget()
				{
					let widget = this.getWidget();
					// update vue compute props when the kekule property is changed
					widget.addEventListener('change', e => {
						if (this.__setComputePropValue__)   // the change is caused by set vue compute prop, nothing to do
							return;
						else   // change by internal widget itself, need to update the vue compute prop cache
						{
							this.__updateComputePropValueCache__ = true;
							try
							{
								e.changedPropNames.forEach(propName => {
									this[propName] = this.getWidget().getPropValue(propName);
								});
							}
							finally
							{
								this.__updateComputePropValueCache__ = false;
							}
						}
					});
					// setup by vue props values
					vueProps.forEach(vuePropName => {
						let prefixLength = vuePropNamePrefix.length;
						let value = this[vuePropName];
						this._setKekulePropValueByVueProp(vuePropName, value);
					});
				},
				_finalizeWidget: function()
				{
					this.widget.finalize();
				},
				_setKekulePropValueByVueProp: function(vuePropName, value)
				{
					let prefixLength = vuePropNamePrefix.length;
					let kPropName = vuePropName.substring(prefixLength, prefixLength + 1).toLowerCase() + vuePropName.substring(prefixLength + 1);
					if (typeof(value) !== 'undefined')
					{
						//console.log('set init prop', vuePropName, kPropName, value);
						this[kPropName] = value;
					}
				}
			},
			mounted()
			{
				let elem = this.$refs.widgetElem;
				this.widget = new widgetClass(elem.ownerDocument);
				this.widget.appendToElem(elem);
				this._initWidget();
			},
			beforeUnmount()
			{
				this._finalizeWidget();
			},
			render(){
				return h('div', {'ref': 'widgetElem'});
			}
		}

		return vueComponent;
	}
}

export default KekuleVue;