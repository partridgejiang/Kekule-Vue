import { Kekule, KekuleVue } from './kekule.vue.base.js';

let wrapWidgetConfigs = [
	{
		'widgetClassName': 'Kekule.ChemWidget.PeriodicTable',
		options: {
			'defaultModelValuePropName': 'selectedSymbols',
			'modelUpdateEventMap': {
				'select': ['selectedSymbol', 'selectedSymbols'],
				'deselect': ['selectedSymbol', 'selectedSymbols']
			}
		}
	},
	{
		'widgetClassName': 'Kekule.ChemWidget.Viewer',
		options: {
			'defaultModelValuePropName': 'chemObj',
			'defaultModelValueGetterMethod': 'getSavingTargetObj',
			'modelUpdateEventMap': {
				'repaint': ['drawOptions', 'moleculeDisplayType', 'zoom', 'padding', 'autofit', 'autoShrink', 'hideHydrogens', 'allowCoordBorrow', 'autoSize', 'baseCoordOffset']
			}
		}
	},
	{
		'widgetClassName': 'Kekule.ChemWidget.SpectrumInspector',
		options: {
			'defaultModelValuePropName': 'chemObj'
		}
	},
	{
		'widgetClassName': 'Kekule.ChemWidget.ChemObjInserter',
		options: {
			'defaultModelValuePropName': 'chemObj'
		}
	},
	{
		'widgetClassName': 'Kekule.ChemWidget.SpectrumObjInserter',
		options: {
			'defaultModelValuePropName': 'chemObj'
		}
	},
	{
		'widgetClassName': 'Kekule.Editor.Composer',
		options: {
			'defaultModelValuePropName': 'chemObj',
			'defaultModelValueGetterMethod': 'getSavingTargetObj',
			'modelUpdateEventMap': {
				'editObjsUpdated': ['chemObj'],
				'repaint': ['drawOptions']
			}
		}
	}
];

function wrapWidgets()
{
	if (KekuleVue.Utils)
	{
		let compNamespace = KekuleVue;
		for (let i = 0, l = wrapWidgetConfigs.length; i < l; ++i)
		{
			var config = wrapWidgetConfigs[i];
			var widgetClass = Object.getCascadeFieldValue(config.widgetClassName, Kekule.$jsRoot);
			if (widgetClass)  // do wrap
			{
				var widgetShortName = Kekule.ClassUtils.getLastClassName(config.widgetClassName);
				var wrapper = KekuleVue.Utils.wrapWidget(widgetClass, config.options);
				compNamespace[widgetShortName] = wrapper;  // add to namespace
			}
		}
		return compNamespace;
	}
	else
	{
		return {};
	}
}

export default wrapWidgets();