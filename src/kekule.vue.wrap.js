import { h, watch, ref } from 'vue';
import { ClassEx, Kekule, KekuleVue } from './kekule.vue.base.js';
import './kekule.vue.css';

Kekule.globalOptions.add('Vue.widgetWrapper', {
	// exposeWidgetPropertiesToVueComputes: true, // there are problems to expose widget property to vue component currently, may be fixed in the future
	exposeWidgetPropertiesToVueProps: true,
	exposeWidgetEvents: true,
	enableVModel: true,
	enableVModelOnAllProperties: true,
	//exposeWidgetMethods: false,
	// widget properties may conflict with element, should not be exposed in wrapping
	ignoredProperties: ['id', 'draggable', 'droppable', 'innerHTML', 'style', 'offsetParent', 'offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight'],
	vuePropNamePrefix: 'vue'
});

ClassEx.extendMethod(Kekule.Widget.BaseWidget, 'dispatchEvent', function($origin, eventName, event){
	let result = $origin(eventName, event);

	let vueComp = this._vueComponent;
	if (vueComp)
	{
		if (vueComp.__emitKekuleEvents__)
		{
			if (!event.vueComponent)
				event.vueComponent = this._vueComponent;
			vueComp.$emit(eventName, event);
		}
		let vueModelInfo = this.__vueModelInfo__;
		if (vueModelInfo && vueModelInfo.eventMap && !vueComp.__propModifiedByVueComponent__)
		{
			let affectedProps = vueModelInfo.eventMap[eventName] || [];
			// if (affectedProps.length)
			// 	console.log(vueModelInfo, affectedProps);
			affectedProps.forEach(propName => {
				/*
				let modelValue;
				if (propName === vueModelInfo.propName)  // default model property
				{
					modelValue = (vueModelInfo.methodName) ? this[vueModelInfo.methodName].bind(this)(): this.getPropValue(propName);
					//console.log('default model value', propName, modelValue);
					//vueComp.$emit('update:modelValue', modelValue);
					vueComp._notifyModelValueChange(propName, modelValue, true);
				}
				if (vueModelInfo.enableOnAllProperties)  // custom model property
				{
					if (modelValue === undefined)
						modelValue = this.getPropValue(propName);
					let vuePropName = KekuleVue.Utils._kekulePropNameToVue(propName, vueModelInfo.vuePropNamePrefix);
					//vueComp.$emit('update:' + vuePropName, modelValue);
					vueComp._notifyModelValueChange(propName, modelValue, false);
					//console.log('update custom', eventName, vuePropName, modelValue);
				}
				*/
				vueComp._notifyModelValueChange(propName);
			});
		}
	}
	return result;
});

ClassEx.extendMethod(Kekule.Widget.BaseWidget, 'getVueComponent', function($origin){
	return this._vueComponent;
});

/**
 * Util functions of Kekule-Vue.
 * @class
 */
KekuleVue.Utils = {
	_kekulePropNameToVue: function(propName, vuePropNamePrefix)
	{
		return vuePropNamePrefix + propName.charAt(0).toUpperCase() + propName.substr(1);
	},
	_vuePropNameToKekule: function(propName, vuePropNamePrefix)
	{
		let prefixLength = vuePropNamePrefix.length;
		return propName.substring(prefixLength, prefixLength + 1).toLowerCase() + propName.substring(prefixLength + 1);
	},
	/**
	 * Wrap a Kekule widget into vue component.
	 * @param {Class} widgetClass
	 * //@param {String} vueTag Vue element tag name binding with this component.
	 * @param {Hash} options May include fields:
	 *   {
	 *     exposeWidgetPropertiesToVueComputes: bool, whether add [kekulePropName] to vue component compute props
	 *     exposeWidgetPropertiesToVueProps: bool, whether add initial[KekulePropName] props to vue component
	 *     exposedProperties: array,
	 *     ignoredProperties: array,
	 *     exposeWidgetEvents: bool, whether emit event on vue component when an event is invoked by Kekule widget,
	 *     enableVModel: bool, whether enable v-model binds in this widget
	 *     enableVModelOnAllProperties: bool,
	 *     defaultModelValuePropName: string, which Kekule property should be bound to v-model,
	 *     defaultModelValueGetterMethod: string, alt to defaultModelValuePropName, the method to get model value,
	 *     modelUpdateEventMap: hash, {eventName: affectedPropsArray}. When these Kekule event is invoked in widget, vue model value should also be notified to change
	 *   }
	 * @returns {Object} Vue component.
	 */
	wrapWidget: function(widgetClass, options)
	{
		let globalOptions = Kekule.globalOptions.Vue.widgetWrapper;
		let ops = Object.extend({
			//exposeWidgetPropertiesToVueComputes: globalOptions.exposeWidgetPropertiesToVueComputes,
			exposeWidgetPropertiesToVueProps: globalOptions.exposeWidgetPropertiesToVueProps,
			exposeWidgetEvents: globalOptions.exposeWidgetEvents,
			ignoredProperties: globalOptions.ignoredProperties,
			exposeWidgetMethods: globalOptions.exposeWidgetMethods,
			vuePropNamePrefix: globalOptions.vuePropNamePrefix,
			enableVModel: globalOptions.enableVModel,
			enableVModelOnAllProperties: globalOptions.enableVModelOnAllProperties
		}, options || {});
		let vuePropNamePrefix = ops.vuePropNamePrefix;
		let enableVModel = ops.enableVModel;
		let enableVModelOnAllProperties = ops.enableVModelOnAllProperties;
		let defaultVueModelPropName = ops.defaultModelValuePropName;
		let defaultVueModelValueGetterMethod = ops.defaultModelValueGetterMethod;
		let vueModelUpdateEventMap = ops.modelUpdateEventMap || {};
		let exposeKekuleEvents = ops.exposeWidgetEvents;

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
			if (false && ops.exposeWidgetPropertiesToVueComputes)  // there are problems to expose widget property to vue component currently, may be fixed in the future
			{
				if (propInfo.getter)  // do not expose write only prop to vue compute
				{
					vueComputes[propName] = {};
					vueComputes[propName].get = function ()
					{
						//return this.widgetRef && this.widgetRef.value.getPropValue(propName);
						return this.widgetRef && this.widgetRef.value[propName];
						//return this.widgetRef && this.widgetRef.getPropValue(propName);
					}
					if (propInfo.setter)
					{
						vueComputes[propName].set = function (value)
						{
							if (!this.__updateComputePropValueCache__)  // special flag, means we are update the vue compute prop cache, no need to actually change the widget
							{
								if (!this.widgetRef)
									return;
								this.__propModifiedByVueComponent__ = true;   // special flag, means the kekule property is changed by vue component
								try
								{
									//this.widgetRef.value.setPropValue(propName, value);
									this.widgetRef.value[propName] = value;
								}
								finally
								{
									this.__propModifiedByVueComponent__ = false;
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
					//let vuePropName = vuePropNamePrefix + propName.charAt(0).toUpperCase() + propName.substr(1);
					let vuePropName = KekuleVue.Utils._kekulePropNameToVue(propName, vuePropNamePrefix);
					vueProps.push(vuePropName);
					vueWatches[vuePropName] = function(newVal, oldVal) {
						//this._setKekulePropValueByVueProp(vuePropName, newVal);
						this._updateWidgetByVuePropValue(vuePropName, newVal, oldVal);
					};
				}
			}
		}

		// has default model property, need to add it to vue props
		if (defaultVueModelPropName)
		{
			vueProps.push('modelValue');
			vueWatches['modelValue'] =  function(newVal, oldVal) {
				this._updateWidgetByVuePropValue(KekuleVue.Utils._kekulePropNameToVue(defaultVueModelPropName, vuePropNamePrefix), newVal, oldVal);
			};
		}

		let vueComponent = {
			//computed: vueComputes,
			props: vueProps,
			watch: vueWatches,
			methods: {
				getWidget() { return this.widget; },
				getWidgetPropValue(propName) { return this.widget.getPropValue(); },
				setWidgetPropValue(propName, value) { this.widget.setPropValue(propName, value); return this; },
				_initWidget()
				{
					let widget = this.getWidget();
					// update vue compute props when the kekule property is changed
					widget.addEventListener('change', e => {
						if (this.__propModifiedByVueComponent__)   // the change is caused by set vue compute prop, nothing to do
							return;
						else   // change by internal widget itself, need to update the vue compute prop cache
						{
							//this.__updateComputePropValueCache__ = true;
							try
							{
								//let widget = this.getWidget();
								e.changedPropNames.forEach(propName => {
									/*
									let value = this.getWidget().getPropValue(propName);
									this[propName] = value;
									*/
									//console.log('prop change', propName, value, widget.__vueModelInfo__);
									/*
									if (widget.__vueModelInfo__) // update vmodel value
									{
										// console.log('update' + KekuleVue.Utils._kekulePropNameToVue(propName, vuePropNamePrefix), value);
										if (widget.__vueModelInfo__.enableOnAllProperties)
										{
											//this.$emit('update:' + KekuleVue.Utils._kekulePropNameToVue(propName, vuePropNamePrefix), value);
											this._notifyModelValueChange(propName, value);
										}
										if (propName === widget.__vueModelInfo__.propName)  // default model value
										{
											if (widget.__vueModelInfo__.methodName)
												value = widget[widget.__vueModelInfo__.methodName].bind(widget)();
											//this.$emit('update:modelValue', value);
											this._notifyModelValueChange(propName, value, true);
										}
									}
									*/
									this._notifyModelValueChange(propName);
								});
							}
							finally
							{
								//this.__updateComputePropValueCache__ = false;
							}
						}
					});
					// setup by vue props values
					vueProps.forEach(vuePropName => {
						let value = this[vuePropName];
						//this._setKekulePropValueByVueProp(vuePropName, value, true);  // only concern about real set prop values
						this._initWidgetWithVuePropValue(vuePropName, value, undefined, true);
					});

				},
				_finalizeWidget()
				{
					this.widget.finalize();
				},

				_setKekulePropValueByVueProp(vuePropName, value, ignoreUndefinedVuePropValue)
				{
					if (ignoreUndefinedVuePropValue && typeof(value) === 'undefined')
						return;
					let kPropName;
					if (vuePropName === 'modelValue')  // default model value, transfer to suitable property name
					{
						let widget = this.getWidget();
						let vueModelInfo = widget.__vueModelInfo__;
						if (vueModelInfo && vueModelInfo.propName)
						{
							kPropName = vueModelInfo.propName;
						}
					}
					else
						kPropName = KekuleVue.Utils._vuePropNameToKekule(vuePropName, vuePropNamePrefix);
					//console.log('set vue prop', this.widget.getClassName(), kPropName, value);
					//if (this[kPropName] !== value)
					if (kPropName)
					{
						//this[kPropName] = value;
						this.__propModifiedByVueComponent__ = true;
						try
						{
							this.getWidget().setPropValue(kPropName, value);
						}
						finally
						{
							this.__propModifiedByVueComponent__ = false;
						}
					}
				},

				_updateWidgetByVuePropValue(vuePropName, newVal, oldVal, ignoreUndefinedVuePropValue)
				{
					/*
					if (newVal && newVal.__$vueModelValueUpdateInvoker$__ === this)
						console.log('prop value returns ', vuePropName, this.widget.getClassName());
					else if (newVal)
						console.log('prop value to right place ', vuePropName, this.widget.getClassName());
					*/
					if (!newVal || newVal.__$vueModelValueUpdateInvoker$__ !== this)
					{
						this._setKekulePropValueByVueProp(vuePropName, newVal, ignoreUndefinedVuePropValue);
					}
				},
				_initWidgetWithVuePropValue(vuePropName, vuePropInitValue)
				{
					this._updateWidgetByVuePropValue(vuePropName, vuePropInitValue, undefined, true);
					let widget = this.getWidget();
					if (vuePropInitValue === undefined && widget.__vueModelInfo__)  // vueProp value is not set, check if Kekule property value is not emoty, if so , a model update event may need to be emitted
					{
						let kPropName = KekuleVue.Utils._vuePropNameToKekule(vuePropName, vuePropNamePrefix);
						let kValue = widget.getPropValue(kPropName);
						if (kValue !== undefined)
						{
							this._notifyModelValueChange(kPropName, kValue);
						}
					}
				},

				_doNotifyModelValueChange(propName, propValue, isDefault)
				{
					let vuePropName = isDefault ? 'modelValue' : KekuleVue.Utils._kekulePropNameToVue(propName, vuePropNamePrefix);
					let propValueType = typeof(propValue);
					// TODO: not a fine solution
					if (propValue && (propValueType === 'object' || propValueType === 'function'))     // complex value, we will attach a special flag here, avoid _updateWidgetByVuePropValue be called on this invoker
						propValue.__$vueModelValueUpdateInvoker$__ = this;
					this.$emit('update:' + vuePropName, propValue);
				},
				_notifyModelValueChange(propName, propValue)
				{
					let widget = this.getWidget();
					if (propValue === undefined)
						propValue = widget.getPropValue(propName);
					if (widget.__vueModelInfo__) // can update vmodel value
					{
						// console.log('update' + KekuleVue.Utils._kekulePropNameToVue(propName, vuePropNamePrefix), value);
						if (widget.__vueModelInfo__.enableOnAllProperties)
						{
							//this.$emit('update:' + KekuleVue.Utils._kekulePropNameToVue(propName, vuePropNamePrefix), value);
							this._doNotifyModelValueChange(propName, propValue);
						}
						if (propName === widget.__vueModelInfo__.propName)  // default model value
						{
							let defaultValue;
							if (widget.__vueModelInfo__.methodName)
								defaultValue = widget[widget.__vueModelInfo__.methodName].bind(widget)();
							else
								defaultValue = propValue;
							//this.$emit('update:modelValue', value);
							this._doNotifyModelValueChange(propName, defaultValue, true);
						}
					}
				}
			},
			created()
			{
				this.__emitKekuleEvents__ = exposeKekuleEvents;
			},
			mounted()
			{
				let elem = this.$refs.componentElem;
				this.widget = new widgetClass(elem.ownerDocument);
				this.widgetRef = ref(this.widget);
				//console.log('create widget', this.widget.getClassName());
				if (enableVModel)
				{
					this.widget.__vueModelInfo__ = {
						'vuePropNamePrefix': vuePropNamePrefix,
						'enableOnAllProperties': enableVModelOnAllProperties,
						'eventMap': vueModelUpdateEventMap,
						'propName': defaultVueModelPropName,
						'methodName': defaultVueModelValueGetterMethod
					};
				}
				let widgetElem = this.widget.getElement();
				// widgetElem.style.position = 'absolute';
				// widgetElem.style.width = '100%';
				// widgetElem.style.height = '100%';
				//widgetElem.style.flex = '1 1 auto';
				//widgetElem.style.margin = 0;
				this.widget.appendToElem(elem);
				this.widget._vueComponent = this;
				this._initWidget();
			},
			beforeUnmount()
			{
				this._finalizeWidget();
			},
			render(){
				return h('div', {'ref': 'componentElem', 'class': 'Kekule-Vue-Component-Wrapper'});
			}
		}

		return vueComponent;
	}
}

export default KekuleVue;